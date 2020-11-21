import { React, useContext } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../utils/store';
import API from '../helper/api';

export default function UploadJSON({ quizId }) {
  const api = new API('http://localhost:5005');
  const token = window.localStorage.getItem('token');
  const query = `Bearer ${token}`;
  const context = useContext(StoreContext);
  const { eachGame: [eachGame, setEachGame] } = context;

  const openSession = () => {
    const div = document.getElementById('uploadFile');
    if (div.style.display === 'none') {
      div.style.display = 'inline-block';
    } else {
      div.style.display = 'none';
    }
  };
  const uploadFile = () => {
    const file = document.getElementById('fileToUpload');
    const UploadF = file.files;
    const reader = new FileReader();
    reader.readAsDataURL(UploadF[0]);
    reader.onload = function (e) {
      const fileString = e.target.result;
      fetch(fileString, {
        method: 'GET',
      }).then((res) => res.json()).then((data) => {
        const newQuestions = [];
        data.map((each) => {
          const qid = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
          const newQ = { ...each };
          newQ.qid = qid;
          newQuestions.push(newQ);
          return each;
        });
        const newEachGame = { ...eachGame };
        newEachGame.questions = newQuestions;
        api.put(`admin/quiz/${quizId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: query,
          },
          body: JSON.stringify({
            questions: newQuestions,
            name: eachGame.name,
            thumbnail: eachGame.thumbnail,
          }),
        })
          .then(() => {
            setEachGame(newEachGame);
            alert('Create Successfully');
          })
          .catch((err) => {
            alert(err);
          });
      }).catch(() => {});
    };
  };

  return (
    <div className="uploadJSONDIV">
      <button className="uploadBTN" type="button" onClick={openSession}>Upload Questions</button>
      <div id="uploadFile">
        <input type="file" id="fileToUpload" accept=".json" />
        <button className="uploadBTN" type="button" onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
}

UploadJSON.propTypes = {
  quizId: PropTypes.string.isRequired,
};
