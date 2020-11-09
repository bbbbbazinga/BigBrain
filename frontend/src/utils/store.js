import React from 'react';
import PropTypes from 'prop-types';

export const StoreContext = React.createContext(null);

const StoryProvider = ({ children }) => {
  const [games, setGames] = React.useState([]);

  const store = {
    games: [games, setGames],
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export default StoryProvider;

StoryProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
