/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LogoutBtn from '../components/Logout';
import API from '../helper/api';
import BarChart from '../components/BarChart';
// import EachResult from '../components/EachResult';

function Results() {
  const { active } = useParams();
  // use score to record each player's total scores
  const [score, setScores] = useState([]);
  // use points to record each question's points
  const [points, setPoints] = useState([]);
  // use correctPer to record the correct percentage of each question
  const [correctPer, setCorrectPer] = useState([]);
  // use avgTime to record each question's average time
  const [avgTime, setAvgTime] = useState([]);
  // use update to refresh the page
  const [update, setUpdate] = useState(0);

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
        setUpdate(1);
      })
      .catch((err) => {
        alert(err);
      });
  }, [active, update]);

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
        const playersScore = {};
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
          playersScore[each.name] = playerScore;
          return playerScore;
        });
        const newScore = [];
        Object.keys(playersScore).map((player) => newScore.push([player, playersScore[player]]));
        newScore.sort((a, b) => b[1] - a[1]);
        const newCorrectPer = [];
        const newAvgTime = [];
        correctNum.map((each) => newCorrectPer
          .push(Number(((each / results.length) * 100).toFixed(2))));
        totalTime.map((each) => newAvgTime.push(Number((each / results.length).toFixed(1))));
        setScores(newScore);
        setCorrectPer(newCorrectPer);
        setAvgTime(newAvgTime);
        // console.log(newScore);
        // console.log(correctNum);
        // console.log(newCorrectPer);
        // console.log(newAvgTime);
      })
      .catch((err) => {
        alert(err);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, update]);

  // show the top 5 users
  const nameScore = (pair) => {
    const temp = new Array(5).fill([null, null]);
    for (let i = 0; i < pair.length && i < 5; i += 1) {
      temp[i] = pair[i];
    }
    return (
      <table>
        <tr>
          <th>Player Name</th>
          <th>Score</th>
        </tr>
        {
          temp.map((each) => (
            <tr>
              <td>{each[0]}</td>
              <td>{each[1]}</td>
            </tr>
          ))
        }
      </table>
    );
  };

  return (
    <div>
      {
        update === 0
          ? <div />
          : (
            <div>
              {/* <div>{test}</div> */}
              <LogoutBtn />
              {/* show the Table of up to top 5 users and their score */}
              {nameScore(score)}
              {/* Bar chart showing a breakdown of what percentage of people (Y axis)
              got certain questions (X axis) correct */}
              <BarChart
                correctPer={correctPer}
                avgTime={avgTime}
              />
            </div>
          )
      }
    </div>
  );
}

export default Results;
