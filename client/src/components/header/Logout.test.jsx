import React from 'react';
import { shallow } from 'enzyme';
import Logout from './Logout';

describe('Logout', () => {
  it('renders without crashing', () => {
    shallow(<Logout />);
  });
});
