import React from 'react';
import FolderNav from './FolderNav';
import NoteList from './NoteList';
import Modal from './Modal';

export default function NotePage(props) {
  return (
    <div className="row h-100 main-container">
      {/* folder nav */}
      <FolderNav
        folders={props.state.folders}
        inFolderEditMode={props.state.inFolderEditMode}
        currentFolder={props.state.currentFolder}
        updateState={props.updateState}
        onFolderDelete={props.funcs.onFolderDelete}
        onFolderEdit={props.funcs.onFolderEdit}
      />

      {/* display page */}
      <div className="col pt-3 display-page">
        <NoteList
          notes={props.state.notes}
          currentFolder={props.state.currentFolder}
          updateState={props.funcs.updateState}
          onAddNote={props.funcs.onAddNote}
          onRemoveNote={props.funcs.onRemoveNote}
          onUpdateNote={props.funcs.onUpdateNote}
        />
      </div>
      {/* Modal */}
      <Modal
        show={props.state.isModal}
        isEdit={props.state.folderEdit}
        errorMessage={props.state.errorMessage}
        onClose={props.funcs.onAddFolder}
        updateState={props.funcs.updateState}
      />
    </div>
  );
}
