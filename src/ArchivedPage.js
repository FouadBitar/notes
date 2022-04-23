import Note from './Note';
import React from 'react';

function ArchivedPage(props) {

    function returnToActiveNotes(note) {
        let activeNote = {...note, archived: false};

        props.onUpdateNote(activeNote);
    }

    return(
        <div className='row'>
            <div className='col'>
                {props.noteState.archivedNotes.map( (item, i) => {
                    return(
                        <div key={item.id} className='row'>
                            <div className='col'>
                                <Note id={item.id} text={item.text} archived={item.archived} />
                            </div>
                            <div className='col-3'>
                                <button className='btn btn-dark btn-sm' onClick={() => returnToActiveNotes(item)}>return</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        
    );
}

export default ArchivedPage;