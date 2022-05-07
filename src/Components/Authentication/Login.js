import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import notesLogo from '../../images/notes-logo.png';

// function Login(props) {
//   const [email, setEmail] = useState();
//   const [password, setPassword] = useState();

//   let navigate = useNavigate();

//   function login(email, pass) {
//     axios
//       .post(
//         '/api/login/test',
//         { email: email, password: pass },
//         {
//           headers: { 'Content-Type': 'application/json' },
//           withCredentials: true,
//         }
//       )
//       .then(({ data }) => {
//         if (data.error) {
//           console.log(data.error);
//           props.updateState({ dbConnection: false });
//         } else {
//           console.log(data);
//           // set authentication to response
//           props.updateState({ auth: data.isAuthenticated });
//         }
//       });
//   }

//   return (
//     <div>
//       <h3
//         style={{
//           display: 'block',
//           width: '100%',
//           padding: '1rem',
//           margin: '0',
//         }}
//       >
//         Login
//       </h3>
//       <div style={{ padding: '1rem' }}>
//         <div style={{ paddingBottom: '1rem' }}>
//           <label style={{ paddingRight: '1rem' }}>Email</label>
//           <input type="text" onChange={(e) => setEmail(e.target.value)} />
//         </div>
//         <div style={{ paddingBottom: '1rem' }}>
//           <label style={{ paddingRight: '1rem' }}>Password</label>
//           <input
//             type="password"
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <div style={{ paddingBottom: '1rem' }}>
//           <button
//             type="submit"
//             onClick={() => {
//               login(email, password);
//               navigate('/notes');
//             }}
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

function Login(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  let navigate = useNavigate();

  function login(email, pass) {
    axios
      .post(
        '/api/login/test',
        { email: email, password: pass },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        if (data.error) {
          console.log(data.error);
          props.updateState({ dbConnection: false });
        } else {
          console.log(data);
          // set authentication to response
          props.updateState({ auth: data.isAuthenticated });
        }
      });
  }

  return (
    <div className="login-top-container">
      <div className="login-second-container">
        <div className="login-logo-container">
          <img className="login-logo" src={notesLogo} alt=""></img>
        </div>

        <div className="login-header-container">
          <h3 className="login-header">Notes Login</h3>
        </div>

        <div className="login-text-container">
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="login-button"
            type="submit"
            onClick={() => {
              login(email, password);
              navigate('/notes');
            }}
          >
            Sign in
          </button>
        </div>

        <div className="login-text-container">
          <div className="login-register-container">
            <a className="login-register-link" type="submit">
              Create an account...
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
