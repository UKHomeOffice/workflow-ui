import React from 'react';
import { shallow } from 'enzyme';
import AccessibilityStatement from './AccessibilityStatement';

describe('Accessibility Statement page', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<AccessibilityStatement />);
    expect(wrapper.exists()).toBe(true);
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<AccessibilityStatement />);
    expect(wrapper).toMatchSnapshot();
  });
});
