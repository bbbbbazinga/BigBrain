import { React, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../utils/store';
import API from '../helper/api';
import imageToDataUrl from '../helper/imageToDataUrl';

// Create a new question component
function CreateQuestion({ quizId }) {
  // 每次新增一个question，eachGame也要对应进行更新
  const context = useContext(StoreContext);
  const { eachGame: [eachGame, setEachGame] } = context;

  const [question, setQuestion] = useState('');
  const [type, setType] = useState('Single select');
  const [timeLimit, setTimeLimit] = useState('');
  const [points, setPoints] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '', '', '']);
  const [checks, setChecks] = useState([false, false, false, false, false, false]);

  // toggle createQuestion div
  const showInput = (event) => {
    event.preventDefault();
    const createDiv = document.querySelector('.createQuestion');
    createDiv.style.display = createDiv.style.display === 'none' ? 'flex' : 'none';
  };

  const changeAnswer = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  const changeCheck = (e, index) => {
    const newChecks = [...checks];
    newChecks[index] = e.target.checked;
    setChecks(newChecks);
  };

  // once click the Add button, trigger the pur method of "admin/quiz/{quizid}"
  const addQuestion = (e) => {
    e.preventDefault();
    // generate a unique question id
    const qid = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
    // the format of each question
    const newQuestion = {
      qid,
      question,
      type,
      timeLimit,
      points,
      image,
      video,
    };
    // the format of each answer is {id:, answer:, correct:}
    newQuestion.answers = [];
    for (let i = 0; i < 6; i += 1) {
      const temp = {
        id: i + 1,
        answer: answers[i],
        correct: checks[i],
      };
      newQuestion.answers.push(temp);
    }

    const newEachGame = { ...eachGame };
    const newQuestions = [...eachGame.questions, newQuestion];
    newEachGame.questions = newQuestions;
    // console.log(newQuestions);
    // console.log(quizId);

    const api = new API('http://localhost:5005');
    const token = window.localStorage.getItem('token');
    const query = `Bearer ${token}`;

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
  };

  // choose a image file for the question and convert it to data base64 format
  const chooseImage = async (e) => {
    const dataUrl = await imageToDataUrl(e.target.files[0]);
    setImage(dataUrl);
  };

  return (
    <div>
      <button type="button" onClick={showInput}>Create a New Question</button>
      <div className="createQuestion" style={{ display: 'none', flexDirection: 'column' }}>
        Question:
        <input type="text" placeholder="Question Description" value={question} onChange={(e) => setQuestion(e.target.value)} />
        Question Type:
        <select onChange={(e) => setType(e.target.value)}>
          <option value="Single select">Single select</option>
          <option value="Multi-select">Multi-select</option>
        </select>
        Time Limit:
        <input type="number" placeholder="End with second" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
        Points:
        <input type="number" placeholder="Points" value={points} onChange={(e) => setPoints(e.target.value)} />
        Upload image:
        <input type="file" placeholder="Select a image" onChange={chooseImage} />
        YouTube Link:
        <input type="text" placeholder="Input a video URL" value={video} onChange={(e) => setVideo(e.target.value)} />
        Answer Box:
        <div className="answerDiv">
          <input type="text" placeholder="Add answer1" value={answers[0]} onChange={(e) => changeAnswer(e, 0)} />
          <input type="checkbox" value={checks[0]} onChange={(e) => changeCheck(e, 0)} />
          <input type="text" placeholder="Add answer2" value={answers[1]} onChange={(e) => changeAnswer(e, 1)} />
          <input type="checkbox" value={checks[1]} onChange={(e) => changeCheck(e, 1)} />
          <input type="text" placeholder="Add answer3 (optional)" value={answers[2]} onChange={(e) => changeAnswer(e, 2)} />
          <input type="checkbox" value={checks[2]} onChange={(e) => changeCheck(e, 2)} />
          <input type="text" placeholder="Add answer4 (optional)" value={answers[3]} onChange={(e) => changeAnswer(e, 3)} />
          <input type="checkbox" value={checks[3]} onChange={(e) => changeCheck(e, 3)} />
          <input type="text" placeholder="Add answer5 (optional)" value={answers[4]} onChange={(e) => changeAnswer(e, 4)} />
          <input type="checkbox" value={checks[4]} onChange={(e) => changeCheck(e, 4)} />
          <input type="text" placeholder="Add answer6 (optional)" value={answers[5]} onChange={(e) => changeAnswer(e, 5)} />
          <input type="checkbox" value={checks[5]} onChange={(e) => changeCheck(e, 5)} />
        </div>
        <button type="button" onClick={addQuestion}>Add</button>
      </div>
    </div>
  );
}

CreateQuestion.propTypes = {
  quizId: PropTypes.string.isRequired,
};

export default CreateQuestion;
