import React from 'react';
import { useHistory } from 'react-router-dom';
import API from '../helper/api';

function LogoutBtn() {
  const history = useHistory();
  const api = new API('http://localhost:5005');
  const token = window.localStorage.getItem('token');
  const query = `Bearer ${token}`;
  // console.log(query);

  const logout = (event) => {
    event.preventDefault();
    api.post('admin/auth/logout', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then(() => {
        window.localStorage.removeItem('token');
        history.push('/login');
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <button type="button" onClick={logout}>Log Out</button>
  );
}

export default LogoutBtn;
