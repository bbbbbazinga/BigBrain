import { React, useEffect, useContext } from 'react';
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

  useEffect(() => {
    const api = new API('http://localhost:5005');
    const token = window.localStorage.getItem('token');
    const query = `Bearer ${token}`;
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
  }, [setGames]);

  return (
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
  );
}

export default Dashboard;
