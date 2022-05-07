import React from 'react';
import notesLogo from '../images/notes-logo.png';
import { useNavigate } from 'react-router-dom';

function Nav(props) {
  let navigate = useNavigate();
  return (
    <div className="row border border-dark">
      <div className="nav-container">
        <img className="logo" src={notesLogo} alt=""></img>
        <h3 id="logo-title">Notes</h3>
        <button
          className="btn btn-outline-dark h-100 ms-3 rounded-0 border-0"
          onClick={() => navigate('/notes')}
        >
          Notes
        </button>
      </div>
    </div>
  );
}

export default Nav;
