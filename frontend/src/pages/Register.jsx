import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../helper/api';

function Register() {
  const history = useHistory();
  const api = new API('http://localhost:5005');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const submitForm = async (event) => {
    event.preventDefault();
    api.post('admin/auth/register', {
      body: JSON.stringify({
        email,
        password,
        name,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        // window.localStorage.setItem('token', JSON.stringify(res));
        history.push('/login');
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <form id="registerForm">
      Email:
      <br />
      <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />
      <br />
      Password:
      <br />
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <br />
      Name:
      <br />
      <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
      <br />
      <button type="submit" form="registerForm" onClick={submitForm}>Register</button>
    </form>
  );
}

export default Register;
