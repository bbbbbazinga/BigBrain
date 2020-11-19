import { React, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '../utils/store';
import API from '../helper/api';

// Each question component, where we can edit or delete
function EachQuestion({
  quizId, questionId, question, name, thumbnail,
}) {
  const history = useHistory();
  const api = new API('http://localhost:5005');
  const token = window.localStorage.getItem('token');
  const query = `Bearer ${token}`;

  const context = useContext(StoreContext);
  const { eachGame: [eachGame, setEachGame] } = context;

  const editOp = (event) => {
    event.preventDefault();
    history.push(`/editquestion/${quizId}/${questionId}`);
  };

  const deleteOp = (event) => {
    event.preventDefault();
    const del = window.confirm('Are you sure to delete');
    if (del) {
      const newEachGame = { ...eachGame };
      const newQuestions = eachGame.questions.filter((q) => (q.qid !== questionId));
      newEachGame.questions = newQuestions;

      api.put(`admin/quiz/${quizId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: query,
        },
        body: JSON.stringify({
          questions: newQuestions,
          name,
          thumbnail,
        }),
      })
        .then(() => {
          setEachGame(newEachGame);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <div className="eachQuestionShow">
      <button className="btnEach" type="button" onClick={deleteOp}>Delete</button>
      <button className="btnEach" type="button" onClick={editOp}>Edit</button>
      {/* <p>
        Game Id:
        {quizId}
      </p>
      <p className="question-id">
        Question Id:
        {questionId}
      </p> */}
      <p>
        Question:
        {question}
      </p>
    </div>
  );
}

EachQuestion.propTypes = {
  quizId: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
};

export default EachQuestion;
