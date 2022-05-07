// Constants
import { NOTE_ID, DELETE_ID } from '../Constants/index';

// Components and functions
import { regexCheckIdIsNote, sortArray, sortArray2 } from './Utils';
import Nav from './Nav';
import Login from './Login';
import NotePage from './Notes/NotePage';

// Frameworks
import React from 'react';
import axios from 'axios';
import { Route, Routes, Navigate } from 'react-router-dom';

// TODO
// add authentication / add react router dom routing
// maybe add some sort of logger for both the frontend and the backend to see what requests are being made and the results
// add the pin option so note goes to top of page
// add option to move around the notes
// make application robust - error handling and input validation
// convert the code to typescript

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNotePage: true,
      isModal: false,
      inFolderEditMode: false,
      notes: [],
      folders: [],
      currentFolder: null,
      errorMessage: '',
      noteClickedId: '-1',
      dbConnection: true,
      folderEdit: null,
      auth: null, // need to check if there is active cookie that says the user is logged in
    };

    this.onAddNote = this.onAddNote.bind(this);
    this.onRemoveNote = this.onRemoveNote.bind(this);
    this.onUpdateNote = this.onUpdateNote.bind(this);
    this.getData = this.getData.bind(this);
    this.addNewRowToDatabase = this.addNewRowToDatabase.bind(this);
    this.addFolderNameToDatabase = this.addFolderNameToDatabase.bind(this);
    this.handleClickEvent = this.handleClickEvent.bind(this);
    this.onAddFolder = this.onAddFolder.bind(this);
    this.onFolderDelete = this.onFolderDelete.bind(this);
    this.updateState = this.updateState.bind(this);
    this.deleteFolderInDatabase = this.deleteFolderInDatabase.bind(this);
    this.updateFolderInDatabase = this.updateFolderInDatabase.bind(this);
    this.onFolderEdit = this.onFolderEdit.bind(this);
    this.setAuth = this.setAuth.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
  }

  async componentDidMount() {
    // first check to see if the user is logged in by sending request to server with cookie
    await this.isLoggedIn();
    // if user is logged in fetch data to display home page
    if (this.state.auth) {
      this.getData();
      this.addEventListenerForClick();
    }
  }

  async isLoggedIn() {
    let res = await axios
      .get('/api/login', {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(({ data }) => {
        if (data.isAuthenticated) {
          this.setAuth(data.isAuthenticated);
          return data.isAuthenticated;
        } else {
          this.setAuth(false);
          return false;
        }
      });
  }

  getData() {
    axios
      .get('/sup', { headers: { 'Content-Type': 'application/json' } })
      .then(({ data }) => {
        // check if error returned
        if (data.error) {
          console.log(data.error);
          this.setState({ dbConnection: false });
        } else {
          let notes = sortArray(data.notes, 'last_updated');

          this.setState({
            ...this.state,
            folders: data.folder_names,
            currentFolder: data.folder_names[0] ? data.folder_names[0] : null,
            notes: notes,
          });
        }
      });
  }

  addEventListenerForClick() {
    document.addEventListener('click', this.handleClickEvent, false);
  }

  handleClickEvent(e) {
    let prevNoteClickedId = this.state.noteClickedId;
    let noteClickedId = e.target.id;

    // check if item and previously clicked item are notes
    const checkPrevClicked = regexCheckIdIsNote(prevNoteClickedId);
    const checkClicked = regexCheckIdIsNote(noteClickedId);

    // get all buttons of page
    var buttons = document.getElementsByTagName('button');

    // get all notes of the page
    let noteIds = [];
    this.state.notes.forEach((note) => {
      if (note.folder === this.state.currentFolder.name) {
        noteIds.push(note.id + NOTE_ID);
      }
    });
    let textareas = [];
    noteIds.forEach((id) => {
      textareas.push(document.getElementById(id));
    });

    // var textareas2 = document.getElementsByTagName("textarea");

    var prevNoteID = prevNoteClickedId.replace(/[^0-9]/g, '');
    var clickedID = noteClickedId.replace(/[^0-9]/g, '');

    // if nothing was clicked before and a note is clicked now
    if (prevNoteClickedId === '-1' && checkClicked) {
      //disable all other buttons
      for (let i = 0; i < buttons.length; i++) {
        var buttonID = buttons[i].getAttribute('id');

        if (buttonID === clickedID + DELETE_ID) {
          buttons[i].removeAttribute('disabled');
        } else {
          buttons[i].setAttribute('disabled', 'true');
        }
      }
      //disable all other text areas
      for (let i = 0; i < textareas.length; i++) {
        var textareaID = textareas[i].getAttribute('id');

        if (textareaID === clickedID + NOTE_ID) {
          textareas[i].removeAttribute('disabled');
        } else {
          textareas[i].setAttribute('disabled', 'true');
        }
      }

      // set prev clicked note to this one
      this.setState({
        ...this.state,
        noteClickedId: noteClickedId,
      });
    }

    // if note is currently selected, and we click on something other than the same note or its two buttons,
    // remove the disables and save the note
    else if (
      checkPrevClicked &&
      noteClickedId !== prevNoteID + NOTE_ID &&
      noteClickedId !== prevNoteID + DELETE_ID
    ) {
      // enable all buttons and text-areas
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].removeAttribute('disabled');
      }
      for (let i = 0; i < textareas.length; i++) {
        textareas[i].removeAttribute('disabled');
      }

      // update the note
      prevNoteID = parseInt(prevNoteID);
      let updateNote = this.state.notes.find((item) => item.id === prevNoteID);
      this.updateRowInDatabase(updateNote);

      // erase previous clicked note as nothing is clicked now and we start from scratch
      this.setState({
        ...this.state,
        noteClickedId: '-1',
      });
    }
    //if currently in select note, and we click on delete, just enable all buttons and remove previous clicked,
    //the other event handler will handle the rest
    else if (checkPrevClicked && noteClickedId === prevNoteID + DELETE_ID) {
      // enable all buttons and text-areas
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].removeAttribute('disabled');
      }
      for (let i = 0; i < textareas.length; i++) {
        textareas[i].removeAttribute('disabled');
      }

      // erase previous clicked note as nothing is clicked now and we start from scratch
      this.setState({
        ...this.state,
        noteClickedId: '-1',
      });
    }
    //if no note selected and we click on anything besides a note (text-area), dont do anything
    else if (!checkPrevClicked && !checkClicked) {
    }
  }

  // ROUTES
  getData() {
    axios
      .get('/sup', { headers: { 'Content-Type': 'application/json' } })
      .then(({ data }) => {
        // check if error returned
        if (data.error) {
          console.log(data.error);
          this.setState({ dbConnection: false });
        } else {
          let notes = sortArray(data.notes, 'last_updated');

          this.setState({
            ...this.state,
            folders: data.folder_names,
            currentFolder: data.folder_names[0] ? data.folder_names[0] : null,
            notes: notes,
          });
        }
      });
  }

  addNewRowToDatabase(row, newState) {
    axios
      .post(
        '/add',
        { note: row, folder: this.state.currentFolder },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(({ data }) => {
        if (data.error) {
          console.log(data.error);
          this.setState({ dbConnection: false });
        } else {
          let notes = sortArray(data, 'last_updated');

          this.setState({
            ...this.state,
            notes: notes,
          });
        }
      });
  }

  addFolderNameToDatabase(row) {
    axios
      .post('/add/foldername', row, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(({ data }) => {
        if (data.error) {
          console.log(data.error);
          this.setState({ dbConnection: false });
        } else {
          //update state with new list of folder names
          this.setState({
            ...this.state,
            folders: data,
          });
        }
      });
  }

  updateRowInDatabase(row) {
    axios
      .put('/update', row, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(({ data }) => {
        if (data.error) {
          console.log(data.error);
          this.setState({ dbConnection: false });
        } else {
          let notes = sortArray(data, 'last_updated');

          this.setState({
            ...this.state,
            notes: notes,
          });
        }
      });
  }

  deleteRowInDatabase(row) {
    axios
      .delete('/delete/' + row.id, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(({ data }) => {
        if (data.error) {
          console.log(data.error);
          this.setState({ dbConnection: false });
        } else {
          let notes = sortArray(data, 'last_updated');

          this.setState({
            ...this.state,
            notes: notes,
          });
        }
      });
  }

  deleteFolderInDatabase(folderID) {
    axios
      .delete('/delete/folder/' + folderID, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(({ data }) => {
        if (data.error) {
          console.log(data.error);
          this.setState({ dbConnection: false });
        } else {
          let folders = data;

          this.setState({
            ...this.state,
            folders: folders,
          });
        }
      });
  }

  updateFolderInDatabase(folder) {
    axios
      .put('update/folder', folder, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(({ data }) => {
        if (data.error) {
          console.log(data.error);
          this.setState({ dbConnection: false });
        } else {
          let folders = data.folders;
          let notes = data.notes;

          this.setState({
            ...this.state,
            folders: folders,
            notes: notes,
          });
        }
      });
  }

  onAddNote(newNote) {
    this.addNewRowToDatabase(newNote);
  }
  onRemoveNote(removeNote) {
    this.deleteRowInDatabase(removeNote);
  }
  onUpdateNote(updateNote) {
    this.updateRowInDatabase(updateNote);
  }

  onAddFolder(inputID, folder) {
    let val = document.getElementById(inputID).value;

    // if folder is null, it is not in edit mode - we are adding a new folder
    if (!folder) {
      // cannot add empty folder name
      if (val === '') {
        this.setState({
          ...this.state,
          errorMessage: 'Cannot add empty folder name',
        });
      } else {
        this.addFolderNameToDatabase({ name: val });
        this.setState({
          ...this.state,
          isModal: false,
          errorMessage: '',
        });
      }
    } else {
      // cannot add empty folder name
      if (val === '') {
        this.setState({
          ...this.state,
          errorMessage: 'Cannot update to empty folder name',
        });
      } else {
        this.updateFolderInDatabase({
          id: folder.id,
          name: val,
          oldName: folder.name,
        });
        this.setState({
          ...this.state,
          isModal: false,
          isEdit: false,
          errorMessage: '',
        });
      }
    }
  }

  onFolderDelete(folder) {
    // check if there are any notes -> if so display error message
    let notes = this.state.notes;
    notes = notes.filter((note) => note.folder === folder.name);
    if (notes.length > 0) {
      this.setState({
        ...this.state,
        errorMessage: 'cannot delete folder with notes',
      });
    } else {
      this.deleteFolderInDatabase(folder.id);
    }
  }

  onFolderEdit(folder) {
    console.log(folder);
    this.setState({ folderEdit: folder, isModal: true });
  }

  updateState(obj) {
    let newState = { ...this.state };
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        newState[key] = obj[key];
      }
    }
    this.setState(newState);
  }

  setAuth(isAuthenticated) {
    this.setState({ auth: isAuthenticated });
  }

  render() {
    console.log(this.state.auth);
    // page has not loaded response from server yet, render nothing
    if (this.state.auth === null) {
      return <div></div>;
    }

    let test = true;
    if (test) {
      console.log('inside test');
      return (
        <div className="container-fluid app">
          <Nav updateState={this.updateState} />
          <Routes>
            <Route
              path="/login"
              element={<Login setAuth={this.setAuth}></Login>}
            ></Route>
            <Route
              path="/notes"
              element={
                this.state.auth ? (
                  <NotePage
                    state={this.state}
                    funcs={
                      (this.updateState,
                      this.onFolderDelete,
                      this.onFolderEdit,
                      this.updateState,
                      this.onAddNote,
                      this.onRemoveNote,
                      this.onUpdateNote,
                      this.onAddFolder)
                    }
                  />
                ) : (
                  <Navigate to="/login"></Navigate>
                )
              }
            ></Route>
            <Route
              path="*"
              element={
                <Navigate to={this.state.auth ? '/notes' : '/login'} replace />
              }
            />
          </Routes>
        </div>
      );
    }

    if (!this.state.auth) {
      return <Login setAuth={this.setAuth} />;
    }
    if (!this.state.dbConnection) {
      return (
        <div>
          <h3>Could not connect to the database</h3>
        </div>
      );
    }

    // <main style={{ padding: '1rem', fontSize: '20px' }}>
    //   <p>There's nothing here!</p>
    // </main>;
    // return (
    //   <div className="container-fluid app">
    //     {/* top nav bar */}
    //     <Nav updateState={this.updateState} />

    //     {/* main row */}
    //     <div className="row h-100 main-container">
    //       {/* folder nav */}
    //       <FolderNav
    //         folders={this.state.folders}
    //         inFolderEditMode={this.state.inFolderEditMode}
    //         currentFolder={this.state.currentFolder}
    //         updateState={this.updateState}
    //         onFolderDelete={this.onFolderDelete}
    //         onFolderEdit={this.onFolderEdit}
    //       />

    //       {/* display page */}
    //       <div className="col pt-3 display-page">
    //         <NoteList
    //           notes={this.state.notes}
    //           currentFolder={this.state.currentFolder}
    //           updateState={this.updateState}
    //           onAddNote={this.onAddNote}
    //           onRemoveNote={this.onRemoveNote}
    //           onUpdateNote={this.onUpdateNote}
    //         />
    //       </div>
    //       {/* Modal */}
    //       <Modal
    //         show={this.state.isModal}
    //         isEdit={this.state.folderEdit}
    //         errorMessage={this.state.errorMessage}
    //         onClose={this.onAddFolder}
    //         updateState={this.updateState}
    //       />
    //     </div>
    //   </div>
    // );
  }
}

export default App;
