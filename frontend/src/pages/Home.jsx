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
      <button className="BTN B1" onClick={handleClickL} type="button">
        Login
      </button>
      <br />
      <button className="BTN B2" onClick={handleClickR} type="button">
        Register
      </button>
    </div>
  );
}

export default Home;
