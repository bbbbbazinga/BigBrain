import { React, useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const StoreContext = createContext(null);

const StoryProvider = ({ children }) => {
  // return from the 'GET/admin/quiz'
  const [games, setGames] = useState([]);
  // return from the 'GET/admin/quiz/{quizid}'
  const [eachGame, setEachGame] = useState({});

  /* format is defined by myself:
      {
        "questionId": "1tlcb5rdp4s",
        "question": "which city is the capital of China",
        "type": "single select",
        "timeLimit": 60,
        "points": 100,
        "image": "",
        "video": "",
        "answers": [
          {
            "id": 1,
            "answer": "Beijing",
            "correct": true
          },
          {
            "id": 2,
            "answer": "Shanghai",
            "correct": false
          },
          ...,
        ]
      }
  */
  const [question, setQuestion] = useState({});

  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);

  const store = {
    games: [games, setGames],
    eachGame: [eachGame, setEachGame],
    question: [question, setQuestion],
    open: [open, setOpen],
    results: [results, setResults],
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export default StoryProvider;

StoryProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
