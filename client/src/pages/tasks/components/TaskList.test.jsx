import React from 'react';
import { shallow } from 'enzyme';
import TaskList from './TaskList';
import { mockNavigate } from '../../../setupTests';

describe('TaskList', () => {
  it('renders without crashing', () => {
    shallow(<TaskList />);
  });

  it('can click on a task', () => {
    const wrapper = shallow(<TaskList tasks={[{
      id: 'id',
      name: 'name',
    }]}
    />);

    wrapper.find('a').simulate('click', {
      preventDefault: () => {},
    });

    expect(mockNavigate).toBeCalledWith('/tasks/id');
  });
});
