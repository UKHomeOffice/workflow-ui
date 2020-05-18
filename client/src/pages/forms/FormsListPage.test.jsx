import React from 'react';
import { shallow } from 'enzyme';
import FormsListPage from './FormsListPage';

describe('FormsListPage', () => {
  it('renders without crashing', () => {
    shallow(<FormsListPage />);
  });
});
