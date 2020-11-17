/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LogoutBtn from '../components/Logout';
import API from '../helper/api';
// import EachResult from '../components/EachResult';

function Results() {
  const { active } = useParams();
  // use score to record each player's total scores
  const [score, setScores] = useState({});
  // use points to record each question's points
  const [points, setPoints] = useState([]);
  // use correctPer to record the correct percentage of each question
  const [correctPer, setCorrectPer] = useState([]);
  // use avgTime to record each question's average time
  const [avgTime, setAvgTime] = useState([]);

  useEffect(() => {
    const api = new API('http://localhost:5005');
    const token = window.localStorage.getItem('token');
    const query = `Bearer ${token}`;
    api.get(`admin/session/${active}/status`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then((data) => {
        const { questions } = data.results;
        const newPoints = [];
        questions.map((each) => newPoints.push(Number(each.points)));
        setPoints(newPoints);
      })
      .catch((err) => {
        alert(err);
      });
  }, [active]);

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
        const { results } = data;
        const newScore = {};
        // initialize an array with all 0
        const correctNum = new Array(points.length).fill(0);
        const totalTime = new Array(points.length).fill(0);
        results.map((each) => {
          const { answers } = each;
          let playerScore = 0;
          answers.map((answer, index) => {
            if (answer.correct) {
              playerScore += points[index];
              correctNum[index] += 1;
            }
            const startTime = new Date(answer.questionStartedAt).getTime() / 1000;
            const endTime = new Date(answer.answeredAt).getTime() / 1000;
            totalTime[index] += (endTime - startTime);
            return playerScore;
          });
          newScore[each.name] = playerScore;
          return playerScore;
        });
        const newCorrectPer = [];
        const newAvgTime = [];
        correctNum.map((each) => newCorrectPer.push(((each / results.length) * 100).toFixed(2)));
        totalTime.map((each) => newAvgTime.push((each / results.length).toFixed(1)));
        setScores(newScore);
        setCorrectPer(newCorrectPer);
        setAvgTime(newAvgTime);
        console.log(newScore);
        console.log(correctNum);
        console.log(newCorrectPer);
        console.log(newAvgTime);
      })
      .catch((err) => {
        alert(err);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

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
