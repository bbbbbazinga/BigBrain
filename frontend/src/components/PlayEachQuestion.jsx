import {
  React,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  ListItem, ListItemText, ListItemSecondaryAction, Checkbox,
} from '@material-ui/core';

import API from '../helper/api';

// Each question component, where we can edit or delete
function PlayEachQuestion({ playerId }) {
  const [curQid, setCurQid] = useState('');
  const [curQ, setCurQ] = useState({});
  // const [answers, setAnswer] = useState(0);
  const [check, setCheck] = useState([false, false, false, false, false, false]);
  const [time, setTime] = useState(null);
  const [correctAns, setCorrectAns] = useState([]);
  const [points, setPoints] = useState([]);
  const [result, setResult] = useState([]);
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

  // polling: to check if the game start
  useEffect(() => {
    const interval = setInterval(() => {
      const api = new API('http://localhost:5005');
      api.get(`play/${playerId}/question`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((data) => {
          if (data.question.qid !== curQid) {
            setCurQid(data.question.qid);
          }
        })
        .catch((err) => {
          if (err !== 'Session has not started yet') {
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
              .then(() => clearInterval(interval));
            // .catch((err) => console.log(err));
          }
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [playerId, curQid, points]);

  // render the question
  useEffect(() => {
    if (curQid !== '') {
      const api = new API('http://localhost:5005');
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
        .catch((err) => {
          console.log(err);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, curQid]);

  // time counter, when time hits 0, returns the correct answer
  useEffect(() => {
    let interval;
    if (curQid !== '') {
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
    }

    return () => clearInterval(interval);
  }, [time, playerId, curQ.answers, curQid]);

  // send answer whenever selections are modified
  useEffect(() => {
    if (curQid !== '') {
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
    }
  }, [check, playerId, curQid]);

  return (
    <div>
      {
        curQid === ''
          ? <div>Waiting for start...</div>
          : (
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
                                      const labelId = `answer ${each}`;
                                      return (
                                        // <div className="Each-answer">
                                        //   <span>{each.answer}</span>
                                        // <input type="checkbox" checked={check[index]} />
                                        // </div>
                                        <ListItem className="Each-answer" key={each} button>
                                          <ListItemText color="secondary" id={labelId} primary={each.answer} />
                                          <ListItemSecondaryAction>
                                            <Checkbox
                                              edge="end"
                                              onChange={(e) => changeCheck(e, index, curQ.type)}
                                              checked={check[index]}
                                              inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                          </ListItemSecondaryAction>
                                        </ListItem>
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
          )
      }
    </div>
  );
}

PlayEachQuestion.propTypes = {
  playerId: PropTypes.number.isRequired,
};

export default PlayEachQuestion;
