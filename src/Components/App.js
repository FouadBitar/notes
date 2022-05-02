// CSS
import "../CSS/App.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

// Components and functions
import { regexCheckIdIsNote, sortArray } from "./Utils";
import NotePage from "./NotePage";
import FolderNav from "./FolderNav";
import Modal from "./Modal";

// Frameworks
import React from "react";

// Images
import notesLogo from "../images/notes-logo.png";

// TODO
// clean up application files - can you make anything modular or simplify your app file
// convert the code to typescript
// make your routes restful
// add the pin option so note goes to top of page
// add option to move around the notes
// add authentication

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
      errorMessage: "",
      noteClickedId: "-1",
    };

    this.onNoteStateChange = this.onNoteStateChange.bind(this);
    this.onAddNote = this.onAddNote.bind(this);
    this.onRemoveNote = this.onRemoveNote.bind(this);
    this.onUpdateNote = this.onUpdateNote.bind(this);
    this.getData = this.getData.bind(this);
    this.addNewRowToDatabase = this.addNewRowToDatabase.bind(this);
    this.addFolderNameToDatabase = this.addFolderNameToDatabase.bind(this);
    this.handleClickEvent = this.handleClickEvent.bind(this);
    this.onAddFolder = this.onAddFolder.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onFolderDelete = this.onFolderDelete.bind(this);
    this.onAddFolderClick = this.onAddFolderClick.bind(this);
    this.onEditFolderClick = this.onEditFolderClick.bind(this);
    this.onFolderSelected = this.onFolderSelected.bind(this);
  }

  componentDidMount() {
    this.getData();
    this.addEventListenerForClick();
  }

  addEventListenerForClick() {
    document.addEventListener("click", this.handleClickEvent, false);
  }

  handleClickEvent(e) {
    let prevNoteClickedId = this.state.noteClickedId;
    let noteClickedId = e.target.id;

    console.log(e);
    console.log(e.target);

    // check if item clicked ID is text-area
    const checkPrevClicked = regexCheckIdIsNote(prevNoteClickedId);
    const checkClicked = regexCheckIdIsNote(noteClickedId);

    // all buttons and inputs of page
    var buttons = document.getElementsByTagName("button");
    var textareas = document.getElementsByTagName("textarea");

    var prevNoteID = prevNoteClickedId.replace(/[^0-9]/g, "");
    var clickedID = noteClickedId.replace(/[^0-9]/g, "");

    // if nothing was clicked before and a note is clicked now
    if (prevNoteClickedId === "-1" && checkClicked) {
      //disable all other buttons
      for (let i = 0; i < buttons.length; i++) {
        var buttonID = buttons[i].getAttribute("id");

        if (
          buttonID === clickedID + "-done" ||
          buttonID === clickedID + "-delete"
        ) {
          buttons[i].removeAttribute("disabled");
        } else {
          buttons[i].setAttribute("disabled", "true");
        }
      }
      //disable all other text areas
      for (let i = 0; i < textareas.length; i++) {
        var textareaID = textareas[i].getAttribute("id");

        if (textareaID === clickedID + "text-area") {
          textareas[i].removeAttribute("disabled");
        } else {
          textareas[i].setAttribute("disabled", "true");
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
      noteClickedId !== prevNoteID + "text-area" &&
      noteClickedId !== prevNoteID + "-delete" &&
      noteClickedId !== prevNoteID + "-done"
    ) {
      // enable all buttons and text-areas
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].removeAttribute("disabled");
      }
      for (let i = 0; i < textareas.length; i++) {
        textareas[i].removeAttribute("disabled");
      }

      // update the note
      prevNoteID = parseInt(prevNoteID);
      let updateNote = this.state.notes.find((item) => item.id === prevNoteID);
      this.updateRowInDatabase(updateNote);

      // erase previous clicked note as nothing is clicked now and we start from scratch
      this.setState({
        ...this.state,
        noteClickedId: "-1",
      });
    }
    //if currently in select note, and we click on either done or delete, just enable all buttons and remove previous clicked,
    //the other event handler will handle the rest
    else if (
      checkPrevClicked &&
      (noteClickedId === prevNoteID + "-delete" ||
        noteClickedId === prevNoteID + "-done")
    ) {
      // enable all buttons and text-areas
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].removeAttribute("disabled");
      }
      for (let i = 0; i < textareas.length; i++) {
        textareas[i].removeAttribute("disabled");
      }

      // erase previous clicked note as nothing is clicked now and we start from scratch
      this.setState({
        ...this.state,
        noteClickedId: "-1",
      });
    }
    //if no note selected and we click on anything besides a note (text-area), dont do anything
    else if (!checkPrevClicked && !checkClicked) {
    }
  }

  getData() {
    fetch("/sup", {
      method: "get",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        //convert all dates to readable format
        // data.forEach((item,i) => data[i] = { ...item, last_updated: new Date(item.last_updated.replace(' ', 'T')) })
        data.notes.forEach(
          (item, i) =>
            (data[i] = {
              ...item,
              last_updated: new Date(item.last_updated),
            })
        );

        let notes = sortArray(data.notes);

        console.log(data.notes);

        this.setState({
          ...this.state,
          folders: data.folder_names,
          currentFolder: data.folder_names[0] ? data.folder_names[0] : null,
          notes: notes,
        });
      });
  }

  addNewRowToDatabase(row, newState) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note: row,
        folder: this.state.currentFolder,
      }),
    };
    fetch("/add", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        let notes = sortArray(data);

        this.setState({
          ...this.state,
          notes: notes,
        });
      });
  }

  addFolderNameToDatabase(row) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    };
    fetch("/add/foldername", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        //update state with new list of folder names
        this.setState({
          ...this.state,
          folders: data,
        });
      });
  }

  updateRowInDatabase(row) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    };
    fetch("/update", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let notes = sortArray(data);

        this.setState({
          ...this.state,
          notes: notes,
        });
      });
  }

  deleteRowInDatabase(row) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/delete" + row.id, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let notes = sortArray(data);

        this.setState({
          ...this.state,
          notes: notes,
        });
      });
  }

  onNoteStateChange(notes) {
    if (notes !== null) {
      this.setState({
        ...this.state,
        notes: notes,
      });
    }
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

  onAddFolderClick() {
    this.setState({
      ...this.state,
      isModal: true,
    });
  }

  onEditFolderClick() {
    this.setState({
      ...this.state,
      inFolderEditMode: !this.state.inFolderEditMode,
    });
  }

  onFolderSelected(item) {
    this.setState({
      ...this.state,
      currentFolder: item,
    });
  }

  onAddFolder(value) {
    let val = document.getElementById(value).value;

    // cannot add empty folder name
    if (val === "") {
      this.setState({
        ...this.state,
        errorMessage: "Cannot add empty folder name",
      });
    } else {
      this.addFolderNameToDatabase({ name: val });
      this.setState({
        ...this.state,
        isModal: false,
        errorMessage: "",
      });
    }
  }

  onFolderDelete() {
    // check if there are any notes -> if so display error message
    let notes = this.state.notes;
  }

  onCancel() {
    this.setState({
      ...this.state,
      isModal: false,
      errorMessage: "",
    });
  }

  render() {
    return (
      <div className="container-fluid app-container">
        {/* logo bar */}
        <div className="row border border-dark">
          <div className="logo-container">
            <img className="logo" src={notesLogo} alt=""></img>
            <h3 id="logo-title">Notes</h3>
            <button
              className="btn btn-outline-dark h-100 ms-3 rounded-0 border-0"
              onClick={() =>
                this.setState({
                  isNotePage: true,
                })
              }
            >
              Notes
            </button>
          </div>
        </div>

        {/* main row */}
        <div
          className="row main-container"
          style={{
            height: "fit-content",
            minHeight: "100%",
          }}
        >
          {/* left nav bar */}
          <FolderNav
            folders={this.state.folders}
            inFolderEditMode={this.state.inFolderEditMode}
            currentFolder={this.state.currentFolder}
            onAddFolderClick={this.onAddFolderClick}
            onEditFolderClick={this.onEditFolderClick}
            onFolderSelected={this.onFolderSelected}
            onFolderDelete={this.onFolderDelete}
          ></FolderNav>

          {/* display page */}
          <div className="col pt-3 display-page">
            <NotePage
              notes={this.state.notes}
              currentFolder={this.state.currentFolder}
              onNoteStateChange={this.onNoteStateChange}
              onAddNote={this.onAddNote}
              onRemoveNote={this.onRemoveNote}
              onUpdateNote={this.onUpdateNote}
            ></NotePage>
          </div>
        </div>

        {/* Modal */}
        <Modal
          show={this.state.isModal}
          errorMessage={this.state.errorMessage}
          onClose={this.onAddFolder}
          onCancel={this.onCancel}
        ></Modal>
      </div>
    );
  }
}

export default App;
