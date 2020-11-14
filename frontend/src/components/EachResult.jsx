import { React } from 'react';
import PropTypes from 'prop-types';

function EachResult({ correct, answeredAt }) {
  return (
    <div style={{ border: '1px solid black', margin: '10px 0' }}>
      <p>
        correct:
        {correct}
      </p>
      <p>
        answeredAt:
        {answeredAt}
      </p>
    </div>
  );
}

EachResult.propTypes = {
  correct: PropTypes.bool.isRequired,
  answeredAt: PropTypes.string.isRequired,
};

export default EachResult;
