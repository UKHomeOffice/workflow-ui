import React from 'react';
import { shallow } from 'enzyme';
import TaskPage from './TaskPage';

describe('TaskPage', () => {
  it('renders without crashing', () => {
    shallow(<TaskPage taskId="id" />);
  });
});
