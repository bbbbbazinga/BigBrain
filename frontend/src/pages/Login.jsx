import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../helper/api';
import '../css/Login.css';

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
      <label htmlFor="email">
        Email:
        <input type="text" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label htmlFor="password">
        Password:
        <input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button className="btn" type="submit" form="loginForm" onClick={loginForm}>Login</button>
    </form>
  );
}

export default Login;
