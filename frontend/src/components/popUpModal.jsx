import {
  React,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
// import Backdrop from '@material-ui/core/Backdrop';
import API from '../helper/api';
import clickToCopy from '../helper/clickToCopy';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    color: 'purple',
    lineHeight: '30px',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid purple',
    borderRadius: '10px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
// { active }
function PopUpModal() {
  const classes = useStyles();
  const api = new API('http://localhost:5005');
  const token = window.localStorage.getItem('token');
  const query = `Bearer ${token}`;
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [active, setActive] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (event) => {
    event.preventDefault();
    const quizId = event.target.parentNode.parentNode.parentNode.querySelector('.game-id').textContent;
    // get the current game's id
    localStorage.setItem('curQuizId', quizId);

    api.post(`admin/quiz/${quizId}/start`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then(() => {
        setOpen(true);
        api.get(`admin/quiz/${quizId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: query,
          },
        })
          .then((data) => {
            setActive(data.active);
            api.get(`admin/session/${data.active}/status`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: query,
              },
            })
              .then((res) => {
                console.log(res.results);
              })
              .catch((err) => {
                alert(err);
              });
          })
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const stopOp = async (event) => {
    event.preventDefault();
    const quizId = event.target.parentNode.parentNode.parentNode.querySelector('.game-id').textContent;
    const stopG = window.confirm('Are you sure to stop the game');
    if (stopG) {
      localStorage.removeItem('curQuizId');
      try {
        await api.post(`admin/quiz/${quizId}/end`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: query,
          },
        });
      } catch (err) {
        if (active === '') {
          alert(err);
        }
        console.log(err);
      }
      if (active !== '') {
        const turnToRes = window.confirm('Would you like to view the results?');
        if (turnToRes) {
          history.push(`/results/${active}`);
        }
      }
    }
  };

  // to advance question
  const nextQ = (event) => {
    event.preventDefault();
    const quizId = event.target.parentNode.parentNode.parentNode.querySelector('.game-id').textContent;

    api.post(`admin/quiz/${quizId}/advance`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then(() => {})
      .catch((err) => alert(err));
  };

  const url = `http://localhost:3000/jointoplay/${active}`;

  const body = (
    <div className={classes.paper} style={modalStyle}>
      <button className="copyBTN" type="button" onClick={handleClose}>X</button>
      <h2 id="sessionTitle">Session ID:</h2>
      <p id="sessionID">{active}</p>
      <h2 id="URLtitle">URL:</h2>
      <p id="urlLink">{url}</p>
      <button className="copyBTN" type="button" onClick={clickToCopy}>Copy Link</button>
    </div>
  );

  return (
    <div className="popUp">
      <div className="options">
        <button className="gameOptions" type="button" onClick={handleOpen}>Start to Play</button>
        <button className="gameOptions" type="button" onClick={stopOp}>Stop the Game</button>
        <button className="gameOptions" type="button" onClick={nextQ}>Advance</button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

// PopUpModal.propTypes = {
//   active: PropTypes.number.isRequired,
// };

export default PopUpModal;
