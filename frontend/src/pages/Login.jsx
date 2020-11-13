import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../helper/api';

// page to login
function Login() {
  const history = useHistory();
  const api = new API('http://localhost:5005');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginForm = async (event) => {
    event.preventDefault();
    api.post('admin/auth/login', {
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        window.localStorage.setItem('token', res.token);
        history.push('/dashboard');
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <form id="loginForm">
      Email:
      <br />
      <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />
      <br />
      Password:
      <br />
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <br />
      <button type="submit" form="loginForm" onClick={loginForm}>Login</button>
    </form>
  );
}

export default Login;