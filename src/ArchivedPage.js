import Note from './Note';
import React from 'react';

function ArchivedPage(props) {

    function returnToActiveNotes(note) {
        let activeNote = {...note, archived: false};

        props.onUpdateNote(activeNote);
    }

    return(
        <div>
            <h3>Archived</h3>
            {props.noteState.archivedNotes.map( (item, i) => {
                return(
                    <div key={item.id}>
                        {console.log(item.archived)}
                        <Note id={item.id} text={item.text} archived={item.archived} />
                        <button onClick={() => returnToActiveNotes(item)}>return</button>
                    </div>
                )
            })}
        </div>
    );
}

export default ArchivedPage;