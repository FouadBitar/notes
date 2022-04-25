import '../CSS/NotePage.css';
import Note from './Note';
import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


const Button = (props) => {
  return (
    <div>
      <button onClick={props.onClick} className={props.className}>{props.text}</button>
    </div>
  );
}

function NotePage(props) {

    function handleChange(id, newValue) { 
        let state = props.noteState;

        let noteIndex = state.notes.findIndex(item => item.id === id);
        state.notes[noteIndex].text = newValue;

        props.onStateChange(state);
    }

    function addNote(){
        const newNote = {text: '', archived: false};

        props.onAddNote(newNote);
    }

    function removeNote({ id }){
        // find note to delete
        let state = props.noteState;
        let removeNote = state.notes.find((note) => note.id === id);
        
        // delete note
        props.onRemoveNote(removeNote);      
    }

    function markAsDone(note){
        let state = props.noteState;
        let archivedNote = state.notes.find((item) => item.id === note.id);
        archivedNote = {
            ...archivedNote,
            archived: true
        };

        props.onUpdateNote(archivedNote);
    }
    
    return(
        <div className="row" >
            <div className="col" >
                {props.noteState.notes.map( (item, i) => {
                    return(
                        <div key={item.id} className='row m-0 mb-3'>
                            <div className='col'>
                                <Note 
                                    id={item.id} 
                                    text={item.text} 
                                    onChange={handleChange} 
                                    archived={item.archived}
                                />
                            </div>
                            <div className='col-2 pe-0 ps-0 h-100'>
                                <button id={item.id + '-delete'} onClick={() => removeNote(item)} className="btn btn-danger btn-sm m-1 button-done-delete button-small">Delete</button>
                                <button id={item.id + '-done'} onClick={() => markAsDone(item)} className="btn btn-success btn-sm m-1 button-done-delete button-small">Done</button>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="col-1 add-button">
                <Button onClick={addNote} text="+" className="btn btn-outline-dark btn-circle" />
            </div>
        </div>
        
    );
}

export default NotePage;
