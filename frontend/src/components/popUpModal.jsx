import { React, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
// import Backdrop from '@material-ui/core/Backdrop';
import API from '../helper/api';
import { StoreContext } from '../utils/store';
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
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
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
  const context = useContext(StoreContext);
  const { open: [open, setOpen] } = context;
  const [modalStyle] = useState(getModalStyle);
  const [active, setActive] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (event) => {
    event.preventDefault();
    const quizId = event.target.parentNode.parentNode.querySelector('.game-id').textContent;
    api.post(`admin/quiz/${quizId}/start`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
    })
      .then(() => {
        console.log('ok');
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

  const stopOp = (event) => {
    event.preventDefault();
    const quizId = event.target.parentNode.parentNode.querySelector('.game-id').textContent;
    const stopG = window.confirm('Are you sure to stop the game');
    if (stopG) {
      api.post(`admin/quiz/${quizId}/end`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: query,
        },
      })
        .then(() => {
          const turnToRes = window.confirm('Would you like to view the results?');
          // alert('Stop Successfully');
          if (turnToRes) {
            history.push(`/results/${active}`);
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const url = `http://localhost:3000/jointoplay/${active}`;

  const body = (
    <div className={classes.paper} style={modalStyle}>
      <button type="button" onClick={handleClose}>X</button>
      <h2 id="sessionTitle">Session ID:</h2>
      <p id="sessionID">{active}</p>
      <h2 id="URLtitle">URL:</h2>
      <p id="urlLink">{url}</p>
      <button type="button" onClick={clickToCopy}>Copy Link</button>
    </div>
  );

  return (
    <div>
      <button type="button" onClick={handleOpen}>Start to Play</button>
      <button type="button" onClick={stopOp}>Stop the Game</button>
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
