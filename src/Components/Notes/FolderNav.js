import folderXLogo from '../../../node_modules/bootstrap-icons/icons/folder-x.svg'
import penLogo from '../../../node_modules/bootstrap-icons/icons/pen.svg'
import React from 'react'

function FolderNav(props) {
  // if edit button is clicked and folder section is in edit mode
  // display the button options for each folder to be edited or deleted
  function displayEditMode(folder) {
    if (props.inFolderEditMode) {
      return (
        <div>
          <button
            className="btn btn-sm btn-outline-dark w-20"
            onClick={() => {
              props.onFolderDelete(folder)
            }}
          >
            <img src={folderXLogo} alt="" />
          </button>
          <button
            className="btn btn-sm btn-outline-dark w-20"
            onClick={() => {
              props.onFolderEdit(folder)
            }}
          >
            <img src={penLogo} alt="" />
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="col-2 pt-3 ps-0 pe-0 folder-nav-container h-100">
      <div className="row pb-3 w-100 d-flex justify-content-center align-items-center border-bottom border-dark">
        {/* add folder and edit folder buttons */}
        <div className="ps-1 pe-1 mb-4 w-90 d-flex justify-content-center">
          <button
            className="m-1 btn btn-sm btn-outline-dark"
            onClick={() => props.updateState({ isModal: true })}
          >
            Add
          </button>
          <button
            className="m-1 btn btn-sm btn-outline-dark w-100"
            onClick={() =>
              props.updateState({ inFolderEditMode: !props.inFolderEditMode })
            }
          >
            Edit
          </button>
        </div>

        {/* maps over folders received from app and displays list of folders */}
        {props.folders.map((item, i) => {
          return (
            <div key={item.id} className="row mb-2">
              <button
                className="btn btn-outline-dark btn-sm w-60"
                onClick={() => {
                  props.updateState({ currentFolder: item })
                }}
                style={
                  props.currentFolder.name === item.name
                    ? {
                        color: 'white',
                        backgroundColor: '#212529',
                      }
                    : {}
                }
              >
                {item.name}
              </button>
              {displayEditMode(item)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FolderNav
