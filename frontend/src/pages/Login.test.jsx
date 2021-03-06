import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Login from './Login';

configure({ adapter: new Adapter() });

describe('Test the login component', () => {
  const wrapper = shallow(<Login />);
  const testProps = {
    email: 'aimee1@gmail.com',
    password: '1234',
  };

  it('check email input exits', () => {
    expect(wrapper.find('input[type="text"]').length).toEqual(1);
  });
  it('check password input exits', () => {
    expect(wrapper.find('input[type="password"]').length).toEqual(1);
  });
  it('check button exits', () => {
    expect(wrapper.find('button').length).toEqual(1);
  });

  it('no props for email input', () => {
    expect(wrapper.find('input[type="text"]').props()).toEqual({
      onChange: expect.any(Function),
      name: 'email',
      type: 'text',
      value: '',
    });
  });
  it('no props for password input', () => {
    expect(wrapper.find('input[type="password"]').props()).toEqual({
      onChange: expect.any(Function),
      name: 'password',
      type: 'password',
      value: '',
    });
  });

  it('should set email on change event with trim', () => {
    wrapper.find('input[type="text"]').simulate('change', {
      target: {
        value: testProps.email,
      },
    });
    expect(wrapper.find('input[type="text"]').prop('value')).toEqual(
      'aimee1@gmail.com',
    );
  });
  it('should set password on change event with trim', () => {
    wrapper.find('input[type="password"]').simulate('change', {
      target: {
        value: testProps.password,
      },
    });
    expect(wrapper.find('input[type="password"]').prop('value')).toEqual(
      '1234',
    );
  });
});
