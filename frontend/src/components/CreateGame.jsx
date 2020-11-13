import { React, useState, useContext } from 'react';
import API from '../helper/api';
import { StoreContext } from '../utils/store';

// Create a new game component
function CreateGame() {
  const api = new API('http://localhost:5005');
  const token = window.localStorage.getItem('token');
  const query = `Bearer ${token}`;

  const [game, setGame] = useState('');
  const context = useContext(StoreContext);
  const { games: [, setGames] } = context;

  // toggle the "create a new game"
  const showInput = (event) => {
    event.preventDefault();
    const createDiv = document.querySelector('.createGame');
    createDiv.style.display = createDiv.style.display === 'none' ? 'block' : 'none';
  };

  // create a new game
  const create = (event) => {
    event.preventDefault();
    api.post('admin/quiz/new', {
      body: JSON.stringify({
        name: game,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then(() => {
        alert('Create successfully');
        setGame('');
        // below use get method again in order to use the "setGames",
        // because post new quiz method doesn't return anything.
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
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div>
      <button type="button" onClick={showInput}>Create a New Game</button>
      <div className="createGame" style={{ display: 'none' }}>
        <input type="text" placeholder="New Game Name" value={game} onChange={(event) => setGame(event.target.value)} />
        <button type="button" onClick={create}>Create</button>
      </div>
    </div>
  );
}

export default CreateGame;
