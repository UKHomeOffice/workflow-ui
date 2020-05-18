import { shallow } from 'enzyme';
import React from 'react';
import Home from './index';

describe('Home', () => {
  it('renders without crashing', () => {
    shallow(<Home />);
  });
});
