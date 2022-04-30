import '../CSS/App.css';
import { regexCheckID, sortArray } from './Utils';
import NotePage from './NotePage';
import Modal from './Modal'
import React from 'react';
import notesLogo from '../images/notes-logo.png';
import folderXLogo from '../../node_modules/bootstrap-icons/icons/folder-x.svg';
import penLogo from '../../node_modules/bootstrap-icons/icons/pen.svg';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


// TODO
// can make folders on the left side for organization
// move the notes tabs to the top nav bar
// add the pin option to the left of each note, so that it goes to the top of the page
// maybe add the option to be able to move around the notes so that they are in a different order
// use typescript


// FOLDERS FEATURE
// add edit button next to "add folder"
// when pressed it will show a delete and edit button next to each folder on the right
// delete will check if all notes are deleted first
// edit will show the modal again with the text of the folder already and will update its name along with all of the ones in the database.

//remove notestate and keep only notes
// remove archived


// convert to mysql instead
// run and build application on online server heroku

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isNotePage: true,
      isModal: false,
      inFolderEditMode: false,
      noteState: {
        notes: []
      },
      folders: [],
      currentFolder: null,
      errorMessage: '',
      noteClickedId: '-1',
    };
    
    this.returnPage = this.returnPage.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onAddNote = this.onAddNote.bind(this);
    this.onRemoveNote = this.onRemoveNote.bind(this);
    this.onUpdateNote = this.onUpdateNote.bind(this);
    this.getData = this.getData.bind(this);
    this.addNewRowToDatabase = this.addNewRowToDatabase.bind(this);
    this.addFolderNameToDatabase = this.addFolderNameToDatabase.bind(this);
    this.handleClickEvent = this.handleClickEvent.bind(this);
    this.onAddFolder = this.onAddFolder.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.diplayEditMode = this.diplayEditMode.bind(this);
    this.onFolderDelete = this.onFolderDelete.bind(this);
        
  }

  componentDidMount() {
    this.getData();
    this.addEventListenerForClick();
  }

  addEventListenerForClick() {
    document.addEventListener('click', this.handleClickEvent, false);
  }

  handleClickEvent(e) {
    
    let prevNoteClickedId = this.state.noteClickedId;
    let noteClickedId = e.target.id;

    // check if items clicked ID is text-area
    const checkPrevClicked = regexCheckID(prevNoteClickedId);
    const checkClicked = regexCheckID(noteClickedId);

    // all buttons and inputs of page
    var buttons = document.getElementsByTagName('button');
    var textareas = document.getElementsByTagName('textarea');

    var prevNoteID = prevNoteClickedId.replace(/[^0-9]/g,'');
    var clickedID = noteClickedId.replace(/[^0-9]/g,'');


    // if the button is archived do nothing
    // if (e.target.getAttribute("archived") === "true"){}

    // if nothing was clicked before and a note is clicked now
    if(prevNoteClickedId === '-1' && checkClicked) {
      
      //disable all other buttons
      for(let i=0; i<buttons.length; i++) {
        var buttonID = buttons[i].getAttribute('id');

        if(buttonID === (clickedID + "-done") || buttonID === (clickedID + "-delete")){
          buttons[i].removeAttribute('disabled');
        } else {
          buttons[i].setAttribute("disabled", "true");
        }
      }
      //disable all other text areas
      for(let i=0; i<textareas.length; i++) {
        var textareaID = textareas[i].getAttribute('id');

        if(textareaID === (clickedID + "text-area")){
          textareas[i].removeAttribute('disabled');
        } else {
          textareas[i].setAttribute("disabled", "true");
        }
      }

      // set prev clicked note to this one
      this.setState({ ...this.state, noteClickedId: noteClickedId });
    }

    // if note is currently selected, and we click on something other than the same note or its two buttons, 
    // remove the disables and save the note
    else if(checkPrevClicked && 
      noteClickedId !== (prevNoteID+"text-area") && 
      noteClickedId !== (prevNoteID+"-delete") && 
      noteClickedId !== (prevNoteID+"-done")) {

      // enable all buttons and text-areas
      for(let i=0; i < buttons.length; i++) { buttons[i].removeAttribute("disabled"); }
      for(let i=0; i < textareas.length; i++) { textareas[i].removeAttribute("disabled"); }

      // update the note
      prevNoteID = parseInt(prevNoteID);
      let updateNote = this.state.noteState.notes.find((item) => item.id === prevNoteID);
      this.updateRowInDatabase(updateNote);

      // erase previous clicked note as nothing is clicked now and we start from scratch
      this.setState({ ...this.state, noteClickedId: '-1' });
      
    }
    //if currently in select note, and we click on either done or delete, just enable all buttons and remove previous clicked,
    //the other event handler will handle the rest
    else if (checkPrevClicked && 
      (noteClickedId === (prevNoteID+"-delete") || 
      noteClickedId === (prevNoteID+"-done"))){

        // enable all buttons and text-areas
      for(let i=0; i < buttons.length; i++) { buttons[i].removeAttribute("disabled"); }
      for(let i=0; i < textareas.length; i++) { textareas[i].removeAttribute("disabled"); }

      // erase previous clicked note as nothing is clicked now and we start from scratch
      this.setState({ ...this.state, noteClickedId: '-1' });

    }
    //if no note selected and we click on anything besides a note (text-area), dont do anything
    else if(!checkPrevClicked && !checkClicked) {}

  }

  getData() {
    console.log('get data is called');
    fetch('http://localhost:3000/', {
         method: 'get',
         headers: {'Content-Type': 'application/json'},
       }).then(response => response.json()).then(data => {
         


          //convert all dates to readable format
          // data.forEach((item,i) => data[i] = { ...item, last_updated: new Date(item.last_updated.replace(' ', 'T')) })
          data.notes.forEach((item,i) => data[i] = { ...item, last_updated: new Date(item.last_updated) })


          //separate archived from active
          // let archived = data.notes.filter(item => item.archived === true);
          // let active = data.notes.filter(item => item.archived === false);

          // //sort the lists
          // archived = sortArray(archived);
          // active = sortArray(active);

          let notes = sortArray(data.notes);

          console.log(data.test);


          this.setState({ 
            ...this.state, 
            folders: data.folder_names, 
            currentFolder: (data.folder_names[0] ? data.folder_names[0] : null),
            // noteState: { ...this.state.noteState, notes: notes, archivedNotes: archived } 
            noteState: { ...this.state.noteState, notes: notes } 
          })
    })
  }

  addNewRowToDatabase(row, newState) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({note: row, folder: this.state.currentFolder})
    };
    fetch('http://localhost:3000/add', requestOptions)
        .then(response => response.json())
        .then(data => {

          // //separate archived from active
          // let archived = data.filter(item => item.archived === true);
          // let active = data.filter(item => item.archived === false);

          // //sort the lists
          // archived = sortArray(archived);
          // active = sortArray(active);

          let notes = sortArray(data.notes);

          this.setState({ 
            ...this.state, 
            // noteState: { ...this.state.noteState, notes: active, archivedNotes: archived }
            noteState: { ...this.state.noteState, notes: notes } 
          })
      });
  }

  addFolderNameToDatabase(row) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    };
    fetch('http://localhost:3000/add/foldername', requestOptions)
        .then(response => response.json())
        .then(data => {
          //update state with new list of folder names
          this.setState({ ...this.state, folders: data })
      });
  }

  updateRowInDatabase(row) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    };
    fetch('http://localhost:3000/update', requestOptions)
        .then(response => response.json())
        .then(data => {

          // //separate archived from active
          // let archived = data.filter(item => item.archived === true);
          // let active = data.filter(item => item.archived === false);

          // //sort the lists
          // archived = sortArray(archived);
          // active = sortArray(active);

          let notes = sortArray(data.notes);

          this.setState({ 
            ...this.state, 
            // noteState: { ...this.state.noteState, notes: active, archivedNotes: archived } 
            noteState: { ...this.state.noteState, notes: notes } 
          })
        });
  }

  deleteRowInDatabase(row) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('http://localhost:3000/delete/' + row.id, requestOptions)
        .then(response => response.json())
        .then(data => {

          // //separate archived from active
          // let archived = data.filter(item => item.archived === true);
          // let active = data.filter(item => item.archived === false);

          // //sort the lists
          // archived = sortArray(archived);
          // active = sortArray(active);

          let notes = sortArray(data.notes);

          this.setState({ 
            ...this.state, 
            // noteState: { ...this.state.noteState, notes: active, archivedNotes: archived } 
            noteState: { ...this.state.noteState, notes: notes } 
          })
        });
  }

  onStateChange(newState) {
    if(newState !== null) {
      this.setState({ ...this.state, noteState: newState });
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

  returnPage() {
    // if(this.state.isNotePage){
    //   return <NotePage 
    //       noteState={this.state.noteState} 
    //       currentFolder={this.state.currentFolder}
    //       onStateChange={this.onStateChange}
    //       onAddNote={this.onAddNote}
    //       onRemoveNote={this.onRemoveNote}
    //       onUpdateNote={this.onUpdateNote}
    //     ></NotePage>
    // } else {
    //   return <ArchivePage 
    //       noteState={this.state.noteState} 
    //       onStateChange={this.onStateChange}
    //       onAddNote={this.onAddNote}
    //       onRemoveNote={this.onRemoveNote}
    //       onUpdateNote={this.onUpdateNote}
    //     ></ArchivePage>
    // }

    return <NotePage 
          noteState={this.state.noteState} 
          currentFolder={this.state.currentFolder}
          onStateChange={this.onStateChange}
          onAddNote={this.onAddNote}
          onRemoveNote={this.onRemoveNote}
          onUpdateNote={this.onUpdateNote}
        ></NotePage>
  }


  onAddFolder(value) {
    let val = document.getElementById(value).value;

    // cannot add empty folder name
    if(val === "") {
      this.setState({...this.state, errorMessage: "Cannot add empty folder name"});
    } else {
      this.addFolderNameToDatabase({name: val})
      this.setState({...this.state, isModal: false, errorMessage: ''})
    }

    
  }

  onFolderDelete() {
    // check if there are any notes -> if so display error message
    let notes = this.state.noteState.notes

  }

  onCancel() {
    this.setState({...this.state, isModal: false, errorMessage: ''})
  }

  diplayEditMode() {
    if(this.state.inFolderEditMode) {
      return (
        <div>
          <button className='btn btn-sm btn-outline-dark w-20' onClick={this.onFolderDelete}>
            <img src={folderXLogo} alt="" />
          </button>
          <button className='btn btn-sm btn-outline-dark w-20'>
            <img src={penLogo} alt="" />
          </button>
        </div>
      );
    }
    return null;
  }



  render() {
    return (
        <div className="container-fluid app-container">

            {/* logo bar */}
            <div className="row border border-dark">
              <div className="logo-container">
                <img className="logo" src={notesLogo} alt=""></img>
                <h3 id="logo-title">Notes</h3>
                <button className="btn btn-outline-dark h-100 ms-3 rounded-0 border-0" onClick={() => this.setState({ isNotePage: true })}>Notes</button>
                {/* <button className="btn btn-outline-dark h-100 ms-3 rounded-0 border-0" onClick={() => this.setState({ isNotePage: false })}>Archived</button> */}
              </div>
            </div>

            {/* main row */}
            <div className="row main-container" style={{"height": "fit-content", "minHeight":"100%"}}>

              {/* left nav bar */}
              <div className="col-2 pt-3 ps-0 pe-0 nav-container h-100" >
                <div className='row pb-3 w-100 d-flex justify-content-center align-items-center border-bottom border-dark'>
                  <div className='ps-1 pe-1 mb-4 w-90 d-flex justify-content-center'>
                    <button className='m-1 btn btn-sm btn-outline-dark' 
                      onClick={()=> this.setState({...this.state, isModal: true})}>
                        Add Folder
                    </button>
                    <button onClick={() => this.setState({...this.state, inFolderEditMode: !this.state.inFolderEditMode})} className='m-1 btn btn-sm btn-outline-dark w-100'>Edit</button>

                  </div>
                  

                  {/* folders */}
                  {this.state.folders.map( (item, i) => {
                    return(
                    <div key={item.id} className='row mb-2'>
                      <button 
                        className='btn btn-outline-dark btn-sm w-60' 
                        onClick={() => this.setState({...this.state, currentFolder: item})}
                        style={(this.state.currentFolder.name === item.name) ? {"color": "white", "backgroundColor": "#212529"} : {}}>
                          {item.name}
                      </button>
                      {this.diplayEditMode()}
                    </div>
                    )
                  })}
                </div>
              </div>

              {/* display page */}
              <div className="col pt-3 display-page">
                {this.returnPage()}
              </div>

            </div>

            {/* Modal */}

            <Modal show={this.state.isModal} errorMessage={this.state.errorMessage} onClose={this.onAddFolder} onCancel={this.onCancel}></Modal>

        </div>
      
    );
  }
  
}

export default App;
