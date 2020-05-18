import React from 'react';
import { shallow } from 'enzyme';
import TasksListPage from './TasksListPage';

describe('TasksListPage', () => {
  it('renders without crashing', () => {
    shallow(<TasksListPage />);
  });
});
