import { React, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../utils/store';
import API from '../helper/api';
import imageToDataUrl from '../helper/imageToDataUrl';

// update component
function UpdateBtn({ quizId }) {
  const api = new API('http://localhost:5005');
  const token = window.localStorage.getItem('token');
  const query = `Bearer ${token}`;

  const [gName, setGName] = useState('');
  const [image, setImage] = useState('');

  const context = useContext(StoreContext);
  const { eachGame: [eachGame, setEachGame] } = context;

  // toggle update name and thumbnail div
  const showInput = (event) => {
    event.preventDefault();
    const nameThumbnail = document.querySelector('.name-thumbnail');
    nameThumbnail.style.display = nameThumbnail.style.display === 'none' ? 'flex' : 'none';
  };

  const update = (event) => {
    event.preventDefault();

    const newEachGame = { ...eachGame };
    newEachGame.name = gName;
    newEachGame.thumbnail = image;
    api.put(`admin/quiz/${quizId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: query,
      },
      body: JSON.stringify({
        questions: newEachGame.questions,
        name: gName,
        thumbnail: image,
      }),
    })
      .then(() => {
        setEachGame(newEachGame);
        alert('Create Successfully');
      })
      .catch((err) => {
        alert(err);
      });
  };

  // choose a image file for the question and convert it to data base64 format
  const chooseImage = async (e) => {
    const dataUrl = await imageToDataUrl(e.target.files[0]);
    setImage(dataUrl);
  };

  return (
    <div>
      <button type="button" onClick={showInput}>Update</button>
      <div className="name-thumbnail" style={{ display: 'none', flexDirection: 'column' }}>
        <div>
          New game name:
          <input type="text" placeholder="New game name" value={gName} onChange={(e) => setGName(e.target.value)} />
        </div>
        <div>
          Upload image:
          <input type="file" placeholder="Select a image" onChange={chooseImage} />
        </div>
        <button type="button" onClick={update}>Submit</button>
      </div>
    </div>
  );
}

UpdateBtn.propTypes = {
  quizId: PropTypes.string.isRequired,
};

export default UpdateBtn;
