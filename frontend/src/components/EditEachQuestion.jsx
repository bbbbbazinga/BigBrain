import {
  React,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox, Button, MenuItem, Select, FormControl, InputLabel,
} from '@material-ui/core';
import { StoreContext } from '../utils/store';
import imageToDataUrl from '../helper/imageToDataUrl';
import API from '../helper/api';

// Edit question component
function EditEachQuestion({ quizId, questionId }) {
  const context = useContext(StoreContext);
  const { question: [question, setQuestion] } = context;
  const { eachGame: [eachGame, setEachGame] } = context;

  const [image, setImage] = useState('');
  const [checked, setChecked] = useState(
    [question.answers[0].correct,
      question.answers[1].correct,
      question.answers[2].correct,
      question.answers[3].correct,
      question.answers[4].correct,
      question.answers[5].correct],
  );

  const changeContent = (e, keyName) => {
    const newQuestion = { ...question };
    newQuestion[keyName] = e.target.value;
    setQuestion(newQuestion);
  };

  const changeAnswer = (e, index) => {
    const newQuestion = { ...question };
    newQuestion.answers[index].answer = e.target.value;
    setQuestion(newQuestion);
  };

  const changeCheck = (e, index) => {
    const newQuestion = { ...question };
    newQuestion.answers[index].correct = e.target.checked;
    setQuestion(newQuestion);
    const newChecked = [...checked];
    newChecked[index] = e.target.checked;
    setChecked(newChecked);
  };

  const chooseImage = async (e) => {
    const dataUrl = await imageToDataUrl(e.target.files[0]);
    setImage(dataUrl);
  };

  const submitChange = (event) => {
    event.preventDefault();
    const api = new API('http://localhost:5005');
    const token = window.localStorage.getItem('token');
    const query = `Bearer ${token}`;

    // when click the submit button, update the url of the image
    const newQuestion = { ...question };
    // check if choose a image, if not, do not update
    if (image !== '') {
      newQuestion.image = image;
      setQuestion(newQuestion);
    }
    // the put method will change the quiz/game itself,
    // so we need to update the eachGame
    const newEachGame = { ...eachGame };
    const newQuestions = [...eachGame.questions];
    const curQuestionIndex = newQuestions.findIndex((q) => q.qid === questionId);
    newQuestions[curQuestionIndex] = newQuestion;
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
        alert('Edit Successfully');
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      Question:
      <input type="text" placeholder="Question Description" value={question.question} onChange={(e) => changeContent(e, 'question')} />
      {/* <select defaultValue={question.type} onChange={(e) => changeContent(e, 'type')}>
        <option value="Single select">Single select</option>
        <option value="Multi-select">Multi-select</option>
      </select> */}
      <FormControl variant="filled">
        <InputLabel id="filled-label">Question Type</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={question.type}
          onChange={(e) => changeContent(e, 'type')}
        >
          <MenuItem value="Single select">Single select</MenuItem>
          <MenuItem value="Multi-select">Multi-select</MenuItem>
        </Select>
      </FormControl>
      Time Limit:
      <input type="number" placeholder="End with second" value={question.timeLimit} onChange={(e) => changeContent(e, 'timeLimit')} />
      Points:
      <input type="number" placeholder="Points" value={question.points} onChange={(e) => changeContent(e, 'points')} />
      Upload image:
      <input type="file" placeholder="Select a image" onChange={chooseImage} />
      YouTube Link:
      <input type="text" placeholder="Input a video URL" value={question.video} onChange={(e) => changeContent(e, 'video')} />
      Answer Box:
      <div className="answerDiv">
        <input type="text" placeholder="Add answer1" value={question.answers[0].answer} onChange={(e) => changeAnswer(e, 0)} />
        {/* <input type="checkbox" checked={checked[0]} onChange={(e) => changeCheck(e, 0)} /> */}
        <Checkbox
          checked={checked[0]}
          onChange={(e) => changeCheck(e, 0)}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <input type="text" placeholder="Add answer2" value={question.answers[1].answer} onChange={(e) => changeAnswer(e, 1)} />
        {/* <input type="checkbox" checked={checked[1]} onChange={(e) => changeCheck(e, 1)} /> */}
        <Checkbox
          checked={checked[1]}
          onChange={(e) => changeCheck(e, 1)}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <input type="text" placeholder="Add answer3 (optional)" value={question.answers[2].answer} onChange={(e) => changeAnswer(e, 2)} />
        {/* <input type="checkbox" checked={checked[2]} onChange={(e) => changeCheck(e, 2)} /> */}
        <Checkbox
          checked={checked[2]}
          onChange={(e) => changeCheck(e, 2)}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <input type="text" placeholder="Add answer4 (optional)" value={question.answers[3].answer} onChange={(e) => changeAnswer(e, 3)} />
        {/* <input type="checkbox" checked={checked[3]} onChange={(e) => changeCheck(e, 3)} /> */}
        <Checkbox
          checked={checked[3]}
          onChange={(e) => changeCheck(e, 3)}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <input type="text" placeholder="Add answer5 (optional)" value={question.answers[4].answer} onChange={(e) => changeAnswer(e, 4)} />
        {/* <input type="checkbox" checked={checked[4]} onChange={(e) => changeCheck(e, 4)} /> */}
        <Checkbox
          checked={checked[4]}
          onChange={(e) => changeCheck(e, 4)}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <input type="text" placeholder="Add answer6 (optional)" value={question.answers[5].answer} onChange={(e) => changeAnswer(e, 5)} />
        {/* <input type="checkbox" checked={checked[5]} onChange={(e) => changeCheck(e, 5)} /> */}
        <Checkbox
          checked={checked[5]}
          onChange={(e) => changeCheck(e, 5)}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      </div>
      <Button color="secondary" type="button" onClick={submitChange}>Submit</Button>
    </div>
  );
}

EditEachQuestion.propTypes = {
  quizId: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
};

export default EditEachQuestion;
