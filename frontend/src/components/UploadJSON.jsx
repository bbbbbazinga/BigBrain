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
  const uploadFile = () => {
    const file = document.getElementById('fileToUpload');
    const UploadF = file.files;
    const reader = new FileReader();
    reader.readAsDataURL(UploadF[0]);
    // 读取完文件之后会回来这里
    reader.onload = function (e) {
      // 读取文件内容
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
        // newQuestions = [...eachGame.questions, newQuestions];
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
      }).catch((err) => console.log(err));
    };
  };

  return (
    <div>
      <input type="file" id="fileToUpload" accept=".json" />
      <button type="button" onClick={uploadFile}>Upload Questions</button>
    </div>
  );
}

UploadJSON.propTypes = {
  quizId: PropTypes.string.isRequired,
};
