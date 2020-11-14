import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import EditGame from './pages/EditGame';
import EditQuestion from './pages/EditQuestion';
import PlayJoin from './pages/PlayJoin';
// import EditQuestion from './pages/EditQuestion';
import StoreProvider from './utils/store';

function App() {
  return (
    <StoreProvider>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route exact path="/">
              Home
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact path="/results/:active">
              <Results />
            </Route>
            <Route exact path="/editgame/:gameid">
              <EditGame />
            </Route>
            <Route exact path="/editquestion/:gameid/:questionid">
              <EditQuestion />
            </Route>
            <Route exact path="/jointoplay/:active">
              <PlayJoin />
            </Route>
          </Switch>
        </div>
      </Router>
    </StoreProvider>
  );
}

export default App;
