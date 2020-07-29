import React from 'react';
import { shallow } from 'enzyme';
import PrivacyAndCookiePolicy from './PrivacyAndCookiePolicy';

describe('Privacy Policy page', () => {
  it('matches snapshot', () => {
    const wrapper = shallow(<PrivacyAndCookiePolicy />);
    expect(wrapper).toMatchSnapshot();
  });
});
