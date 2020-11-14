import { React, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import LogoutBtn from '../components/Logout';
import API from '../helper/api';
import { StoreContext } from '../utils/store';
// import EachResult from '../components/EachResult';

function Results() {
  const { active } = useParams();
  const context = useContext(StoreContext);
  const { results: [, setResults] } = context;
  useEffect(() => {
    const api = new API('http://localhost:5005');
    const token = window.localStorage.getItem('token');
    const query = `Bearer ${token}`;
    api.get(`admin/session/${active}/results`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then((data) => {
        console.log(data);
        setResults(data);
      })
      .catch((err) => {
        alert(err);
      });
  }, [setResults, active]);

  return (
    <div>
      <LogoutBtn />
      {/* {
        JSON.stringify(results) === JSON.stringify({})
          ? <>None</>
          : results.answers.map((eachPlayer) => (
            <EachResult
              correct={eachPlayer.correct}
              answeredAt={eachPlayer.answeredAt}
            />
          ))
      } */}
    </div>
  );
}

export default Results;
