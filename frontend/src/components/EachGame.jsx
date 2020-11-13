import { React, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import API from '../helper/api';
import { StoreContext } from '../utils/store';

// Each game component, where we can edit or delete
function EachGame({
  id, title, numbers, time, thumbnail,
}) {
  const api = new API('http://localhost:5005');
  const token = window.localStorage.getItem('token');
  const query = `Bearer ${token}`;

  const context = useContext(StoreContext);
  const { games: [games, setGames] } = context;

  const history = useHistory();

  const editOp = (event) => {
    event.preventDefault();
    const quizId = event.target.parentNode.querySelector('.game-id').textContent;
    history.push(`/editgame/${quizId}`);
  };

  const deleteOp = (event) => {
    event.preventDefault();
    const quizId = event.target.parentNode.querySelector('.game-id').textContent;
    const del = window.confirm('Are you sure to delete');
    if (del) {
      api.delete(`admin/quiz/${quizId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: query,
        },
      })
        .then(() => {
          // alert('Delete Successfully');
          // use setGames to update the page information
          const newGames = games.filter((game) => game.id !== Number(quizId));
          setGames(newGames);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <div style={{ border: '1px solid black', margin: '10px 0' }}>
      <button type="button" onClick={editOp}>Edit</button>
      <button type="button" onClick={deleteOp}>Delete</button>
      <p className="game-id">
        {id}
      </p>
      <p>
        Title:
        {title}
      </p>
      <p>
        Number of questions:
        {numbers}
      </p>
      <p>
        Total Time:
        {time}
      </p>
      <img src={thumbnail} alt="thumbnail" />
    </div>
  );
}

EachGame.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  numbers: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
};

export default EachGame;
