import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  function login(email, pass) {
    axios
      .post(
        '/api/login',
        { email: email, password: pass },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        if (data.error) {
          console.log(data.error);
          //   this.setState({ dbConnection: false });
        } else {
          // re route to the app page
        }
      });
  }

  function register(user, email, password) {
    axios
      .post('/api/register', {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then(({ data }) => {
        if (data.error) {
          console.log(data.error);
        } else {
        }
      });
  }

  return (
    <div>
      <h3>login page</h3>

      <label>Username</label>
      <input type="text" onChange={(e) => setUserName(e.target.value)} />
      <label>Email</label>
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      <label>Password</label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} />

      <button type="submit" onClick={() => login(email, password)}>
        Submit
      </button>
    </div>
  );
}

export default Login;
