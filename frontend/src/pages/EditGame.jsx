import { React, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import LogoutBtn from '../components/Logout';
import CreateQuestion from '../components/CreateQuestion';
import API from '../helper/api';
import { StoreContext } from '../utils/store';
import EachQuestion from '../components/EachQuestion';

// page to show all the questions in a particular
// and choose which question to be edited or deleted
function EditGame() {
  const { gameid } = useParams();
  const history = useHistory();

  const context = useContext(StoreContext);
  const { eachGame: [eachGame, setEachGame] } = context;

  useEffect(() => {
    const api = new API('http://localhost:5005');
    const token = window.localStorage.getItem('token');
    const query = `Bearer ${token}`;
    api.get(`admin/quiz/${gameid}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then((data) => {
        // console.log(data);
        setEachGame(data);
      })
      .catch((err) => {
        alert(err);
      });
  }, [setEachGame, gameid]);

  return (
    <div>
      <button type="button" onClick={() => history.push('/dashboard')}>Back</button>
      <LogoutBtn />
      <CreateQuestion
        quizId={gameid}
      />
      {
        JSON.stringify(eachGame) === JSON.stringify({})
          ? <>None</>
          : eachGame.questions.map((q) => (
            <EachQuestion
              key={q.qid}
              quizId={gameid}
              questionId={q.qid}
              question={q.question}
              name={eachGame.name}
              thumbnail={eachGame.thumbnail}
            />
          ))
      }
    </div>
  );
}

export default EditGame;
