import { React, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@material-ui/core';
import { StoreContext } from '../utils/store';
import API from '../helper/api';
import imageToDataUrl from '../helper/imageToDataUrl';
import UploadJSON from './UploadJSON';

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
      <button className="createQBTN" type="button" onClick={showInput}>Create a New Question</button>
      <UploadJSON quizId={quizId} />
      <form className="createQuestion" style={{ display: 'none' }}>
        <label htmlFor="question">
          <span style={{ width: '30%' }}>Question:</span>
          <input id="question" type="text" placeholder="Question Description" value={question} onChange={(e) => setQuestion(e.target.value)} />
        </label>
        <label htmlFor="questionTypeSel">
          <span style={{ width: '30%' }}>Question Type:</span>
          <select id="questionTypeSel" onChange={(e) => setType(e.target.value)}>
            <option value="Single select">Single select</option>
            <option value="Multi-select">Multi-select</option>
          </select>
        </label>
        {/* <FormControl variant="filled">
          <InputLabel id="filled-label">Question Type</InputLabel>
          <Select
            labelId="qtype-select-label"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="Single select">Single select</MenuItem>
            <MenuItem value="Multi-select">Multi-select</MenuItem>
          </Select>
        </FormControl> */}
        <label htmlFor="timeLimit">
          <span style={{ width: '30%' }}>Time Limit (s):</span>
          <input id="timeLimit" type="number" placeholder="End with second" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
        </label>
        <label htmlFor="points">
          <span style={{ width: '30%' }}>Points:</span>
          <input id="points" type="number" placeholder="Points" value={points} onChange={(e) => setPoints(e.target.value)} />
        </label>
        <label htmlFor="UploadIMG">
          <span style={{ width: '30%' }}>Upload Image:</span>
          <input id="UploadIMG" type="file" placeholder="Select a image" onChange={chooseImage} />
        </label>
        <label htmlFor="YouTubeLink">
          <span style={{ width: '30%' }}>YouTube Link:</span>
          <input id="YouTubeLink" type="text" placeholder="Input a video URL" value={video} onChange={(e) => setVideo(e.target.value)} />
        </label>
        <p>Answer Box:</p>
        <div className="answerDiv">
          <label htmlFor="check0">
            <input type="text" placeholder="Add answer1" value={answers[0]} onChange={(e) => changeAnswer(e, 0)} />
            <Checkbox
              id="check0"
              value={checks[0]}
              onChange={(e) => changeCheck(e, 0)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </label>
          <label htmlFor="check1">
            <input type="text" placeholder="Add answer2" value={answers[1]} onChange={(e) => changeAnswer(e, 1)} />
            <Checkbox
              id="check1"
              value={checks[1]}
              onChange={(e) => changeCheck(e, 1)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </label>
          <label htmlFor="check2">
            <input type="text" placeholder="Add answer3" value={answers[2]} onChange={(e) => changeAnswer(e, 2)} />
            <Checkbox
              id="check2"
              value={checks[2]}
              onChange={(e) => changeCheck(e, 2)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </label>
          <label htmlFor="check3">
            <input type="text" placeholder="Add answer4" value={answers[3]} onChange={(e) => changeAnswer(e, 3)} />
            <Checkbox
              id="check3"
              value={checks[3]}
              onChange={(e) => changeCheck(e, 3)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </label>
          <label htmlFor="check4">
            <input type="text" placeholder="Add answer5" value={answers[4]} onChange={(e) => changeAnswer(e, 4)} />
            <Checkbox
              id="check4"
              value={checks[4]}
              onChange={(e) => changeCheck(e, 4)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </label>
          <label htmlFor="check5">
            <input type="text" placeholder="Add answer6" value={answers[5]} onChange={(e) => changeAnswer(e, 5)} />
            <Checkbox
              id="check5"
              value={checks[5]}
              onChange={(e) => changeCheck(e, 5)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </label>
        </div>
        <button className="uploadBTN" type="button" onClick={addQuestion}>Add</button>
      </form>
    </div>
  );
}

CreateQuestion.propTypes = {
  quizId: PropTypes.string.isRequired,
};

export default CreateQuestion;
