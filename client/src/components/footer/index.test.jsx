import React from 'react';
import { shallow } from 'enzyme';
import Footer from './index';
import { mockNavigate } from '../../setupTests';

describe('Footer', () => {
  it('renders without crashing', () => {
    shallow(<Footer />);
  });

  it('can access accessibility', () => {
    const wrapper = shallow(<Footer />);
    const accessibilityLink = wrapper.find('a[id="accessibility"]').at(0);
    accessibilityLink.simulate('click', {
      preventDefault: () => {},
    });
    expect(mockNavigate).toBeCalledWith('/accessibility-statement');
  });

  it('can access privacy', () => {
    const wrapper = shallow(<Footer />);
    const accessibilityLink = wrapper.find('a[id="privacy"]').at(0);
    accessibilityLink.simulate('click', {
      preventDefault: () => {},
    });
    expect(mockNavigate).toBeCalledWith('/privacy-and-cookie-policy');
  });
});
