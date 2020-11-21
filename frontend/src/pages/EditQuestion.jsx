import {
  React, useState, useEffect, useContext,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import LogoutBtn from '../components/Logout';
import API from '../helper/api';
import { StoreContext } from '../utils/store';
import ShowEachQuestion from '../components/ShowEachQuestion';
import EditEachQuestion from '../components/EditEachQuestion';
import '../css/EditQuestion.css';
// page to edit a particular question,
// click the Edit btn to show the "edit part"
// click the UnEdit btn to show the "basic information of the question"
// the initial part is the "basic information of the question"
function EditQuestion() {
  const { gameid, questionid } = useParams();
  const history = useHistory();
  const [toggle, setToggle] = useState(true);

  const context = useContext(StoreContext);
  const { question: [question, setQuestion] } = context;
  const { eachGame: [eachGame] } = context;

  useEffect(() => {
    const api = new API('http://localhost:5005');
    const token = window.localStorage.getItem('token');
    const query = `Bearer ${token}`;

    // get current question's details
    api.get(`admin/quiz/${gameid}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then((data) => {
        const curQuestion = data.questions.find((q) => (q.qid === questionid));
        setQuestion(curQuestion);
      })
      .catch((err) => {
        alert(err);
      });
  }, [setQuestion, gameid, questionid]);

  return (
    <div className="editQ content">
      <div className="topCreate">
        <LogoutBtn />
        <button type="button" onClick={() => history.goBack()}>Back</button>
      </div>
      <div className="subHead">
        <h2>{eachGame.name}</h2>
        <button className="editAction" type="button" onClick={() => setToggle(!toggle)}>{toggle === true ? 'Edit' : 'UnEdit'}</button>
      </div>
      {
      toggle === true
        ? (
          <div>
            {
              JSON.stringify(question) === JSON.stringify({})
                ? <>None</>
                : <ShowEachQuestion />
            }
          </div>
        )
        : (
          <div>
            <EditEachQuestion
              quizId={gameid}
              questionId={questionid}
            />
          </div>
        )
      }
    </div>
  );
}

export default EditQuestion;
