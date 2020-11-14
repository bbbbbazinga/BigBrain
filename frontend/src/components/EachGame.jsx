import {
  React,
  useContext,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import API from '../helper/api';
import { StoreContext } from '../utils/store';
import PopUpModal from './popUpModal';

// Each game component, where we can edit or delete
function EachGame({
  id, title, thumbnail, active,
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

  // use get method of "admin/quiz/${quizid}" to get the number of questions and total time
  const [qNum, setQNum] = useState(0);
  const [qTime, setQTime] = useState(0);

  useEffect(() => {
    api.get(`admin/quiz/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then((data) => {
        setQNum(data.questions.length);
        const newQTime = data.questions.reduce((total, q) => (total + Number(q.timeLimit)), 0);
        setQTime(newQTime);
      })
      .catch((err) => {
        alert(err);
      });
  });

  return (
    <div style={{ border: '1px solid black', margin: '10px 0' }}>
      <button type="button" onClick={editOp}>Edit</button>
      <button type="button" onClick={deleteOp}>Delete</button>
      <PopUpModal active={active} />
      <p className="game-id">
        {id}
      </p>
      <p>
        Title:
        {title}
      </p>
      <p>
        Number of questions:
        {qNum}
      </p>
      <p>
        Total Time:
        {qTime}
      </p>
      {
        thumbnail === null
          ? <div />
          : <img src={thumbnail} alt="thumbnail" />
      }
    </div>
  );
}

EachGame.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  active: PropTypes.number.isRequired,
};

export default EachGame;
