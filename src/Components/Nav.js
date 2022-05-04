import React from "react";
import notesLogo from "../images/notes-logo.png";

function Nav(props) {
  return (
    <div className="row border border-dark">
      <div className="nav-container">
        <img className="logo" src={notesLogo} alt=""></img>
        <h3 id="logo-title">Notes</h3>
        <button
          className="btn btn-outline-dark h-100 ms-3 rounded-0 border-0"
          //   onClick={() => this.setState({ isNotePage: true })}
          onClick={props.updateState}
        >
          Notes
        </button>
      </div>
    </div>
  );
}

export default Nav;
