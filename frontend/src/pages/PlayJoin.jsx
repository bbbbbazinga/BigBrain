import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../helper/api';

function PlayJoin() {
  const { active } = useParams();
  const api = new API('http://localhost:5005');

  const [name, setName] = useState('');

  const nameForm = async (event) => {
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
        console.log(res);
        const playGame = document.querySelector('.playGame');
        playGame.style.display = playGame.style.display === 'none' ? 'block' : 'none';
        const nForm = document.querySelector('#nameForm');
        nForm.style.display = nForm.style.display === 'none' ? 'block' : 'none';
        api.get(`play/${res.playerId}/question`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((data) => {
            console.log(data);
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
    <>
      <form id="nameForm">
        Player Name:
        <br />
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        <br />
        <button type="submit" form="nameForm" onClick={nameForm}>Play</button>
      </form>
      <div className="playGame" style={{ display: 'none' }}>
        play it
      </div>
    </>
  );
}

export default PlayJoin;
