import React from 'react';

function Register() {
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
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
      <h3
        style={{
          display: 'block',
          width: '100%',
          padding: '1rem',
          margin: '0',
        }}
      >
        Register
      </h3>
      <div style={{ padding: '1rem' }}>
        <div style={{ paddingBottom: '1rem' }}>
          <label style={{ paddingRight: '1rem' }}>Username</label>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </div>
        <div style={{ paddingBottom: '1rem' }}>
          <label style={{ paddingRight: '1rem' }}>Email</label>
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={{ paddingBottom: '1rem' }}>
          <label style={{ paddingRight: '1rem' }}>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{ paddingBottom: '1rem' }}>
          <button type="submit" onClick={() => login(email, password)}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
