import React from 'react';
import notesLogo from '../images/notes-logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Nav(props) {
  let navigate = useNavigate();

  function logout() {
    // send to the database that the user is logging out to close the session and delete the cookie in the browser
    axios
      .post(
        '/api/logout/test',
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        if (!data.success) {
          console.log(data.error);
        } else {
          // set authentication to true
          props.updateState({ auth: false });
        }
      });

    // update the state to not authenticated

    // application will automatically redirect to the login page
  }

  return (
    <div className="row border border-dark nav-container">
      <div className="col-2">
        <div className="d-flex justify-content-center">
          <img className="rounded logo" src={notesLogo} alt=""></img>
        </div>
      </div>
      <div className="col-2">
        <h3
          id="logo-title"
          className="d-flex h-100 justify-content-center align-items-center"
        >
          Notes
        </h3>
      </div>
      <div className="col-2">
        <div className="d-flex justify-content-center align-items-center h-100">
          <button
            className="btn btn-outline-dark rounded-0 border-0 h-100"
            onClick={() => navigate('/notes')}
          >
            Notes
          </button>
        </div>
      </div>
      <div className="col-2" style={{ marginLeft: 'auto' }}>
        <div className="d-flex justify-content-center align-items-center h-100">
          <button
            className="d-flex justify-content-center align-items-center btn btn-outline-dark h-100 rounded-0 border-0"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Nav;
