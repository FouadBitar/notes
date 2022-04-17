import './NotePage.css';
import Note from './Note';
import React from 'react';


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
        <div>

            <Button onClick={addNote} text="Add" className="Add-Note-Button" />
            <h3>Notes</h3>
            {props.noteState.notes.map( (item, i) => {
                return(
                <div key={item.id}>
                    <Note 
                        id={item.id} 
                        text={item.text} 
                        onChange={handleChange} 
                        archived={item.archived}
                        />
                    <button id={item.id + '-delete'} onClick={() => removeNote(item)} className="Delete-Button">delete</button>
                    <button id={item.id + '-done'} onClick={() => markAsDone(item)}>done</button>
                </div>
                )
            })}
        </div>
    );
}

export default NotePage;
