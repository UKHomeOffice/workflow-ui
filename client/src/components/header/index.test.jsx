import React from 'react';
import { shallow, mount } from 'enzyme';
import Header from './index';
import { mockNavigate } from '../../setupTests';

describe('Header', () => {
  it('renders without crashing', () => {
    shallow(<Header />);
  });

  it('can click logout', () => {
    const wrapper = mount(<Header />);
    wrapper.find('a[id="logout"]').at(0).simulate('click');
    expect(mockNavigate).toBeCalledWith('/logout');
  });
  it('can click home', () => {
    const wrapper = mount(<Header />);
    wrapper.find('a[id="home"]').at(0).simulate('click');
    expect(mockNavigate).toBeCalledWith('/');
  });
});
