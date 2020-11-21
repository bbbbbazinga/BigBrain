import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../helper/api';

// page to register
function Register() {
  const history = useHistory();
  const api = new API('http://localhost:5005');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const submitForm = async (event) => {
    event.preventDefault();
    if (email === '' || password === '' || name === '') {
      alert('Please fill the form!');
    } else {
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
    }
  };

  return (
    <form id="registerForm">
      <label htmlFor="email">
        Email:
        <input type="text" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label htmlFor="password">
        Password:
        <input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <label htmlFor="name">
        Name:
        <input name="name" type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <button className="btn" type="submit" form="registerForm" onClick={submitForm}>Register</button>
    </form>
  );
}

export default Register;
