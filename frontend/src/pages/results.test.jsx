import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Results from './Results';

configure({ adapter: new Adapter() });

describe('Results component', () => {
  describe('when provided with an empty array of players', () => {
    it('contains an tr element', () => {
      const content = shallow(<Results nameScore={[]} />);
      // const temp = [];
      expect(content.find('.resultTable').length).toEqual(1);
      // expect(content).toContainReact(<table />);
    });
    // it('does not contain any <li> elements', () => {
    //   const toDoList = shallow(<ToDoList tasks={[]} />);
    //   expect(toDoList.find('li').length).toEqual(0);
    // });
  });

  // describe('when provided with an array of tasks', () => {
  //   it('contains a matching number of <li> elements', () => {
  //     const tasks = ['Wash the dishes', 'Make the bed'];
  //     const toDoList = shallow(<ToDoList tasks={tasks} />);
  //     expect(toDoList.find('li').length).toEqual(tasks.length);
  //   });
  // });
});
