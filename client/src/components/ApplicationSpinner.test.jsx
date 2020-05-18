import React from 'react';
import { shallow } from 'enzyme';
import ApplicationSpinner from './ApplicationSpinner';

describe('ApplicationSpinner', () => {
  it('renders without crashing', () => {
    shallow(<ApplicationSpinner />);
  });
});
