import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import BarChart from './BarChart';

configure({ adapter: new Adapter() });

describe('BarCharts component', () => {
  describe('pass correctPer and avgTime', () => {
    const correctPer = [70, 50, 60];
    const avgTime = [10.1, 12.5, 13.0];

    it('to test each Bar', () => {
      const wrapper = shallow(<BarChart correctPer={correctPer} avgTime={avgTime} />);
      expect(wrapper.children()).toHaveLength(2);
      expect(wrapper.childAt(0).props().data).toBeDefined();
      expect(wrapper.childAt(0).props().options).toBeDefined();
      expect(wrapper.childAt(1).props().data).toBeDefined();
      expect(wrapper.childAt(1).props().options).toBeDefined();
      expect(wrapper.find('.Bar')).toBeDefined();
    });
  });
});
