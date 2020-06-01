import React from 'react';
import { shallow } from 'enzyme';
import SkipLink from './SkipLink';
import * as obj from '../utils/scrollToMainContent';

describe('SkipLink component', () => {
  it('triggers function on click', () => {
    const clickHandler = jest.spyOn(obj, 'scrollToMainContent');
    const wrapper = shallow(<SkipLink />);
    const link = wrapper.find('a');
    link.simulate('click', { preventDefault: jest.fn() });
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });
});
