import { useHistory } from 'react-router-dom';
import API from '../helper/api';

function LogoutBTN() {
  const history = useHistory();
  const api = new API('http://localhost:5005');
  const token = window.localStorage.getItem('token');
  // const logout = document.getElementById('logout');
  const query = `Bearer ${token}`;
  console.log(query);

  api.post('admin/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: query,
    },
  })
    .then(() => {
      window.localStorage.removeItem('token');
      history.push('/login');
      document.getElementById('logout').style.display = 'none';
      document.getElementById('login').style.display = 'block';
    })
    .catch((err) => {
      alert(err);
    });
}

export default LogoutBTN;
