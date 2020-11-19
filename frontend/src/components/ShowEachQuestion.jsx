import {
  React, useContext,
} from 'react';
import { StoreContext } from '../utils/store';

// The component only used for show the question's details
function ShowEachQuestion() {
  const context = useContext(StoreContext);
  const { question: [question] } = context;

  return (
    <div className="editEachQShow">
      <div>
        Question:
        {question.question}
      </div>
      <div>
        Question Type:
        {question.type}
      </div>
      <div>
        Time Limit:
        {question.timeLimit}
      </div>
      <div>
        Points:
        {question.points}
      </div>
      <div>
        Upload image:
        <img src={question.image} alt="questionImage" style={{ width: '150px', objectFit: 'contain' }} />
      </div>
      <div>
        YouTube Link:
        {question.video}
      </div>
      <div>
        Answer 1:
        {question.answers[0].answer}
      </div>
      <div>
        Answer 2:
        {question.answers[1].answer}
      </div>
      <div>
        Answer 3:
        {question.answers[2].answer}
      </div>
      <div>
        Answer 4:
        {question.answers[3].answer}
      </div>
      <div>
        Answer 5:
        {question.answers[4].answer}
      </div>
      <div>
        Answer 6:
        {question.answers[5].answer}
      </div>
    </div>
  );
}

export default ShowEachQuestion;
