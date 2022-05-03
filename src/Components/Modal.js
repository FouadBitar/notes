import "../CSS/Modal.css";
import React from "react";

function Modal(props) {
  if (!props.show) {
    return null;
  }
  return (
    <div className="modal">
      <div className="modal-content">
        <input
          id="modal-input"
          className="form-control"
          placeholder="enter folder name..."
        ></input>
        <div style={{ color: "red" }}>
          <p>{props.errorMessage ? props.errorMessage : ""}</p>
        </div>
        <div className="buttons">
          <button
            className="btn btn-primary w-40 me-3"
            onClick={(e) => props.onClose("modal-input")}
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
