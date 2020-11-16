import { React, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import { useHistory } from 'react-router-dom';
import API from '../helper/api';

// Each question component, where we can edit or delete
function PlayEachQuestion({ playerId }) {
  const [curQ, setCurQ] = useState({});
  // const [answers, setAnswer] = useState(0);
  const [check, setCheck] = useState([false, false, false, false, false, false]);
  const [time, setTime] = useState(null);
  const [correctAns, setCorrectAns] = useState([]);
  const [result, setResult] = useState([]);
  const [points, setPoints] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [correctRate, setCorrectRate] = useState(0);

  const changeSingleCheck = (event, index) => {
    const newCheck = [false, false, false, false, false, false];
    if (event.target.checked) {
      newCheck[index] = true;
    }
    setCheck(newCheck);
  };

  const changeMultiCheck = (event, index) => {
    const newCheck = [...check];
    newCheck[index] = event.target.checked;
    setCheck(newCheck);
  };

  const changeCheck = (event, index, selectType) => {
    if (selectType === 'Single select') {
      changeSingleCheck(event, index);
    }
    if (selectType === 'Multi-select') {
      changeMultiCheck(event, index);
    }
  };

  const toNextQuestion = (event) => {
    event.preventDefault();
    const api = new API('http://localhost:5005');
    const token = window.localStorage.getItem('token');
    const query = `Bearer ${token}`;
    const curQuizId = localStorage.getItem('curQuizId');
    api.post(`admin/quiz/${curQuizId}/advance`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then(() => {
        api.get(`play/${playerId}/question`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((data) => {
            setCurQ(data.question);
            setTime(Number(data.question.timeLimit));
            setCheck([false, false, false, false, false, false]);
            setCorrectAns([]);
            setPoints([...points, Number(data.question.points)]);
            console.log(data.question);
            console.log(playerId);
          })
          .catch(() => {
            // if there is not more question, then to show the result
            api.get(`play/${playerId}/results`, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((data) => {
                // show the result of each question, true/false
                const newResult = data.map((each) => each.correct);
                setResult(newResult);
                // count correct rate
                const correctNum = data.filter((each) => each.correct === true);
                setCorrectRate(correctNum.length / data.length);
                // count total points
                let newTotalPoints = 0;
                for (let i = 0; i < data.length; i += 1) {
                  if (data[i].correct === true) {
                    newTotalPoints += points[i];
                  }
                }
                setTotalPoints(newTotalPoints);
              })
              .catch((err) => console.log(err));
          });
      })
      .catch((err) => console.log(err));
  };

  // initialize the page
  useEffect(() => {
    const api = new API('http://localhost:5005');
    api.get(`play/${playerId}/question`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => {
        setCurQ(data.question);
        setTime(Number(data.question.timeLimit));
        setPoints([Number(data.question.points)]);
        console.log(data.question);
        console.log(playerId);
      })
      .catch((err) => {
        alert(err);
      });
  }, [playerId]);

  // time counter, when time hits 0, returns the correct answer
  useEffect(() => {
    let interval;
    if (time > 0) {
      interval = setInterval(() => {
        setTime((t) => t - 1);
      }, 1000);
    }
    if (time === 0) {
      const api = new API('http://localhost:5005');
      api.get(`play/${playerId}/answer`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((data) => {
          const { answerIds } = data;
          const newCorrectAns = curQ.answers
            .filter((each) => answerIds.includes(each.id))
            .map((each) => each.answer);
          setCorrectAns(newCorrectAns);
        })
        .catch((err) => console.log(err));
    }

    return () => clearInterval(interval);
  }, [time, playerId, curQ.answers]);

  // send answer whenever selections are modified
  useEffect(() => {
    const answerIds = [];
    for (let i = 0; i < 6; i += 1) {
      if (check[i]) {
        answerIds.push(i + 1);
      }
    }
    const api = new API('http://localhost:5005');
    api.put(`play/${playerId}/answer`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answerIds,
      }),
    })
      .then(() => console.log('success'))
      .catch((err) => console.log(err));
  }, [check, playerId]);

  return (
    <div>
      {
        result.length === 0
          // show each question
          ? (
            <div style={{ border: '1px solid black', margin: '10px 0' }}>
              {
                JSON.stringify(curQ) === JSON.stringify({})
                  ? <div />
                  : (
                    <div>
                      <p>
                        {`(${curQ.type}) Question:`}
                        {curQ.question}
                      </p>
                      {
                        curQ.video === ''
                          ? <div />
                          : (
                            <p>
                              Video:
                              {curQ.video}
                            </p>
                          )
                      }
                      {
                        curQ.image === ''
                          ? <div />
                          : (
                            <p>
                              Image:
                              {curQ.image}
                            </p>
                          )
                      }
                      <p>
                        Time left:
                        {time}
                      </p>
                      <div className="answerDiv">
                        {
                          curQ.answers.map((each, index) => {
                            if (each.answer !== '') {
                              return (
                                <div className="Each-answer">
                                  <span>{each.answer}</span>
                                  <input type="checkbox" checked={check[index]} onChange={(e) => changeCheck(e, index, curQ.type)} />
                                </div>
                              );
                            }
                            return (<div />);
                          })
                        }
                      </div>
                      {
                        correctAns.length === 0
                          ? <div />
                          : (
                            <div style={{ marginTop: '30px' }}>
                              Correct Answer:
                              {correctAns.map((answer) => (<p>{answer}</p>))}
                            </div>
                          )
                      }
                      <button type="button" onClick={toNextQuestion}>Next Question</button>
                    </div>
                  )
              }
            </div>
          )
          // show the key results of the player
          : (
            <div>
              <p>You have finished all the questions, below is your performance:</p>
              {
                result.map((each, index) => <div>{`Question${index + 1}: ${each} (Points: ${points[index]})`}</div>)
              }
              <p>{`Correct Rate: ${(correctRate * 100).toFixed(2)}%`}</p>
              <p>{`Total Points: ${totalPoints}`}</p>
            </div>
          )
      }
    </div>
  );
}

PlayEachQuestion.propTypes = {
  playerId: PropTypes.number.isRequired,
};

export default PlayEachQuestion;
