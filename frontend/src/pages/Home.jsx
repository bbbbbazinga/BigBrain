import React from 'react';
import { useHistory } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  const history = useHistory();
  const handleClickL = () => {
    history.push('/login');
  };
  const handleClickR = () => {
    history.push('/register');
  };

  return (
    <div className="mainPage">
      <h1>
        Welcome!
      </h1>
      <button className="BTN" onClick={handleClickL} type="button">
        Login
      </button>
      <br />
      <button className="BTN" onClick={handleClickR} type="button">
        Register
      </button>
    </div>
  );
}

export default Home;
