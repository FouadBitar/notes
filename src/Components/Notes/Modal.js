import React from "react";

const FOLDER_MODAL_INPUT_ID = "folder-modal-input";

function Modal(props) {
  if (!props.show) {
    return null;
  }
  return (
    <div className="modal">
      <div className="modal-content">
        {/* input */}
        <input
          id={FOLDER_MODAL_INPUT_ID}
          className="form-control"
          defaultValue={props.isEdit ? props.isEdit.name : null}
          placeholder={props.isEdit ? null : "enter folder name..."}
        ></input>
        <div style={{ color: "red" }}>
          <p>{props.errorMessage ? props.errorMessage : ""}</p>
        </div>

        {/* buttons */}
        <div className="buttons">
          <button
            className="btn btn-primary w-40 me-3"
            onClick={() =>
              props.isEdit
                ? props.onClose(FOLDER_MODAL_INPUT_ID, props.isEdit)
                : props.onClose(FOLDER_MODAL_INPUT_ID, null)
            }
          >
            submit
          </button>
          <button
            className="btn btn-primary w-40 ms-3"
            onClick={(e) =>
              props.updateState({ isModal: false, errorMessage: "" })
            }
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
