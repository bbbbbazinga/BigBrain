import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../helper/api';
import PlayEachQuestion from '../components/PlayEachQuestion';

function PlayJoin() {
  const { active } = useParams();
  const api = new API('http://localhost:5005');
  // const token = window.localStorage.getItem('token');
  // const query = `Bearer ${token}`;
  const curQuizId = localStorage.getItem('curQuizId');
  const [name, setName] = useState('');
  const [playerId, setPlayerId] = useState(0);

  const nameForm = (event) => {
    event.preventDefault();
    api.post(`play/join/${active}`, {
      body: JSON.stringify({
        name,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        alert('Play Games');
        setPlayerId(res.playerId);
        console.log(res.playerId);
        const playGame = document.querySelector('.playGame');
        playGame.style.display = playGame.style.display === 'none' ? 'block' : 'none';
        const nForm = document.querySelector('#nameForm');
        nForm.style.display = nForm.style.display === 'none' ? 'block' : 'none';
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      <form id="nameForm">
        Player Name:
        <br />
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        <br />
        <button type="submit" form="nameForm" onClick={nameForm}>Play</button>
      </form>
      {
        playerId === 0
          ? <div />
          : (
            <div className="playGame" style={{ display: 'none' }}>
              <PlayEachQuestion
                playerId={playerId}
                curQuizId={curQuizId}
              />
            </div>
          )
      }
    </>
  );
}

export default PlayJoin;
