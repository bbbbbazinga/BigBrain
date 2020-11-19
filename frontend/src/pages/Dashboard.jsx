import {
  React,
  useEffect,
  useContext,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import LogoutBtn from '../components/Logout';
import CreateGame from '../components/CreateGame';
import EachGame from '../components/EachGame';
import API from '../helper/api';
import { StoreContext } from '../utils/store';
import '../css/Dashboard.css';

// page to show all created games
// and provided a create btn to create new game
function Dashboard() {
  const context = useContext(StoreContext);
  const { games: [games, setGames] } = context;
  const history = useHistory();
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const api = new API('http://localhost:5005');
    const token = window.localStorage.getItem('token');
    if (token === null) {
      alert('You should log in first');
      history.push('/login');
    } else {
      const query = `Bearer ${token}`;
      setValid(true);
      api.get('admin/quiz', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: query,
        },
      })
        .then((data) => {
          setGames(data.quizzes);
        })
        .catch((err) => {
          alert(err);
        });
    }
  }, [setGames, history]);

  return (
    <div>
      {
        valid
          ? (
            <div className="content">
              <LogoutBtn />
              <div>
                <CreateGame />
              </div>
              {games.map((eachGame) => (
                <EachGame
                  key={eachGame.id}
                  id={eachGame.id}
                  title={eachGame.name}
                  thumbnail={eachGame.thumbnail}
                  active={eachGame.active}
                />
              ))}
            </div>
          )
          : <div />
      }
    </div>
  );
}

export default Dashboard;
