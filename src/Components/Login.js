import React, { useState } from "react";

function Login() {
  sessionStorage.setItem("test", "it works");
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  return (
    <div>
      <h3>login page</h3>
      <form>
        <label>
          <p>Username</p>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" />
        </label>
        <div>
          <button type="submit" onChange={(e) => setPassword(e.target.value)}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
