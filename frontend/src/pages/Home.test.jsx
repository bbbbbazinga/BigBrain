import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Home from './Home';

configure({ adapter: new Adapter() });

describe('Test the login component', () => {
  const wrapper = shallow(<Home />);
  it('should match the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('check H1', () => {
    expect(wrapper.find('h1').text()).toEqual('Welcome!');
  });

  it('contains a button with the "Login"', () => {
    expect(wrapper.find('.B1').text()).toEqual('Login');
  });

  it('contains a button with the "Register"', () => {
    expect(wrapper.find('.B2').text()).toEqual('Register');
  });
});
