import React from 'react';
import FolderNav from './FolderNav';
import NoteList from './NoteList';
import Modal from './Modal';

export default function NotePage(props) {
  return (
    <div className="container-fluid app">
      <div className="row h-100 main-container">
        {/* folder nav */}
        <FolderNav
          folders={props.state.folders}
          inFolderEditMode={props.state.inFolderEditMode}
          currentFolder={props.state.currentFolder}
          updateState={props.updateState}
          onFolderDelete={props.onFolderDelete}
          onFolderEdit={props.onFolderEdit}
        />

        {/* display page */}
        <div className="col pt-3 display-page">
          <NoteList
            notes={props.state.notes}
            currentFolder={props.state.currentFolder}
            updateState={props.updateState}
            onAddNote={props.onAddNote}
            onRemoveNote={props.onRemoveNote}
            onUpdateNote={props.onUpdateNote}
          />
        </div>
        {/* Modal */}
        <Modal
          show={props.state.isModal}
          isEdit={props.state.folderEdit}
          errorMessage={props.state.errorMessage}
          onClose={props.onAddFolder}
          updateState={props.updateState}
        />
      </div>
    </div>
  );
}
