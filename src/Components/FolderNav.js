import folderXLogo from "../../node_modules/bootstrap-icons/icons/folder-x.svg";
import penLogo from "../../node_modules/bootstrap-icons/icons/pen.svg";
import "../CSS/App.css";
import React from "react";

function FolderNav(props) {
  function displayEditMode() {
    if (props.inFolderEditMode) {
      return (
        <div>
          <button
            className="btn btn-sm btn-outline-dark w-20"
            onClick={props.onFolderDelete}
          >
            <img src={folderXLogo} alt="" />
          </button>
          <button className="btn btn-sm btn-outline-dark w-20">
            <img src={penLogo} alt="" />
          </button>
        </div>
      );
    }
    return null;
  }
  return (
    <div className="col-2 pt-3 ps-0 pe-0 nav-container h-100">
      <div className="row pb-3 w-100 d-flex justify-content-center align-items-center border-bottom border-dark">
        <div className="ps-1 pe-1 mb-4 w-90 d-flex justify-content-center">
          <button
            className="m-1 btn btn-sm btn-outline-dark"
            onClick={props.onAddFolderClick}
          >
            Add Folder
          </button>
          <button
            className="m-1 btn btn-sm btn-outline-dark w-100"
            onClick={props.onEditFolderClick}
          >
            Edit
          </button>
        </div>

        {/* folders */}
        {props.folders.map((item, i) => {
          return (
            <div key={item.id} className="row mb-2">
              <button
                className="btn btn-outline-dark btn-sm w-60"
                onClick={props.onFolderSelected}
                style={
                  props.currentFolder.name === item.name
                    ? {
                        color: "white",
                        backgroundColor: "#212529",
                      }
                    : {}
                }
              >
                {item.name}
              </button>
              {displayEditMode()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FolderNav;
