import React from 'react';
import { shallow, mount } from 'enzyme';
import { LoginPage } from './LoginPage';
import { mockLogin } from '../../setupTests';

describe('LoginPage', () => {
  it('renders without crashing', () => {
    shallow(<LoginPage />);
  });
  it('displays login button', async () => {
    const wrapper = await mount(<LoginPage />);
    expect(wrapper.find('button').length).toBe(1);
  });

  it('keycloak login on button click', async () => {
    const wrapper = await mount(<LoginPage />);
    const button = wrapper.find('button').at(0);
    button.simulate('click');
    expect(mockLogin).toBeCalled();
  });
});
