import Note from './Note'
import React from 'react'

function NoteList(props) {
  function handleChange(id, newValue) {
    let notes = props.notes

    let noteIndex = notes.findIndex((item) => item.id === id)
    notes[noteIndex].text = newValue

    props.updateState({ notes: notes })
  }

  function addNote() {
    const newNote = { text: '' }

    props.onAddNote(newNote)
  }

  function removeNote({ id }) {
    let notes = props.notes
    let removeNote = notes.find((note) => note.id === id)

    props.onRemoveNote(removeNote)
  }

  return (
    <div className="row">
      <div className="col">
        {props.notes.map((item, i) => {
          if (props.currentFolder && item.folder === props.currentFolder.name) {
            return (
              <div key={item.id} className="row m-0 mb-3">
                <div className="col">
                  <Note id={item.id} text={item.text} onChange={handleChange} />
                </div>
                <div className="col-2 pe-0 ps-0 h-100">
                  <button
                    id={item.id + '-delete'}
                    onClick={() => removeNote(item)}
                    className="btn btn-danger btn-sm m-1 button-done-delete button-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          } else return null
        })}
      </div>

      <div className="col-1 add-button">
        <button onClick={addNote} className="btn btn-outline-dark btn-circle">
          +
        </button>
      </div>
    </div>
  )
}

export default NoteList
