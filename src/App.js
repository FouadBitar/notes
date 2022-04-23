import './App.css';
import { regexCheckID, sortArray } from './Utils';
import NotePage from './NotePage';
import ArchivePage from './ArchivedPage'
import React from 'react';
import notesLogo from './images/notes-logo.png';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


// TODO
// can make folders on the left side for organization
// move the notes/archived tabs to the top nav bar
// add the pin option to the left of each note, so that it goes to the top of the page
// maybe add the option to be able to move around the notes so that they are in a different order

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isNotePage: true,
      noteState: {
        notes: [],
        archivedNotes: []
      },
      noteClickedId: '-1',
    };
    
    this.returnPage = this.returnPage.bind(this);
    this.setIsNotePage = this.setIsNotePage.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onAddNote = this.onAddNote.bind(this);
    this.onRemoveNote = this.onRemoveNote.bind(this);
    this.onUpdateNote = this.onUpdateNote.bind(this);
    this.getData = this.getData.bind(this);
    this.addNewRowToDatabase = this.addNewRowToDatabase.bind(this);
    this.handleClickEvent = this.handleClickEvent.bind(this);
        
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
    if (e.target.getAttribute("archived") === "true"){}

    // if nothing was clicked before and a note is clicked now
    else if(prevNoteClickedId === '-1' && checkClicked) {
      
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
    fetch('http://localhost:3000/', {
         method: 'get',
         headers: {'Content-Type': 'application/json'},
       }).then(response => response.json()).then(data => {

          //convert all dates to readable format
          // data.forEach((item,i) => data[i] = { ...item, last_updated: new Date(item.last_updated.replace(' ', 'T')) })
          data.forEach((item,i) => data[i] = { ...item, last_updated: new Date(item.last_updated) })


          //separate archived from active
          let archived = data.filter(item => item.archived === true);
          let active = data.filter(item => item.archived === false);

          //sort the lists
          archived = sortArray(archived);
          active = sortArray(active);


          this.setState({ ...this.state, noteState: { ...this.state.noteState, notes: active, archivedNotes: archived } })
    })
  }

  addNewRowToDatabase(row, newState) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    };
    fetch('http://localhost:3000/add', requestOptions)
        .then(response => response.json())
        .then(data => {

          //separate archived from active
          let archived = data.filter(item => item.archived === true);
          let active = data.filter(item => item.archived === false);

          //sort the lists
          archived = sortArray(archived);
          active = sortArray(active);

          this.setState({ ...this.state, noteState: { ...this.state.noteState, notes: active, archivedNotes: archived } })
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

          //separate archived from active
          let archived = data.filter(item => item.archived === true);
          let active = data.filter(item => item.archived === false);

          //sort the lists
          archived = sortArray(archived);
          active = sortArray(active);

          this.setState({ ...this.state, noteState: { ...this.state.noteState, notes: active, archivedNotes: archived } })
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

          //separate archived from active
          let archived = data.filter(item => item.archived === true);
          let active = data.filter(item => item.archived === false);

          //sort the lists
          archived = sortArray(archived);
          active = sortArray(active);

          this.setState({ ...this.state, noteState: { ...this.state.noteState, notes: active, archivedNotes: archived } })
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
    if(this.state.isNotePage){
      return <NotePage 
          noteState={this.state.noteState} 
          onStateChange={this.onStateChange}
          onAddNote={this.onAddNote}
          onRemoveNote={this.onRemoveNote}
          onUpdateNote={this.onUpdateNote}
        ></NotePage>
    } else {
      return <ArchivePage 
          noteState={this.state.noteState} 
          onStateChange={this.onStateChange}
          onAddNote={this.onAddNote}
          onRemoveNote={this.onRemoveNote}
          onUpdateNote={this.onUpdateNote}
        ></ArchivePage>
    }
  }

  setIsNotePage(value) {
    this.setState({ isNotePage: value });
  }





  render() {
    return (
        <div className="container-fluid app-container">

            {/* logo bar */}
            <div className="row border border-dark">
              <div className="logo-container">
                <img className="logo" src={notesLogo} alt=""></img>
                <h3 id="logo-title">Notes</h3>
                <button className="btn btn-outline-dark h-100 ms-3 rounded-0 border-0" onClick={() => this.setIsNotePage(true)}>Notes</button>
                <button className="btn btn-outline-dark h-100 ms-3 rounded-0 border-0" onClick={() => this.setIsNotePage(false)}>Archived</button>
              </div>
            </div>

            {/* main row */}
            <div className="row main-container" style={{"height": "fit-content", "minHeight":"100%"}}>

              {/* left nav bar */}
              <div className="col-2 pt-3 nav-container h-100" >
                <span className='row pb-2 w-100'>
                  {/* <button className="btn btn-outline-dark" onClick={() => this.setIsNotePage(true)}>Notes</button> */}
                </span>
                <span className='row w-100'>
                  {/* <button className="btn btn-outline-dark" onClick={() => this.setIsNotePage(false)}>Archived</button> */}
                </span>
              </div>

              {/* display page */}
              <div className="col pt-3 display-page">
                {this.returnPage()}
              </div>

            </div>

        </div>
      
    );
  }
  
}

export default App;
