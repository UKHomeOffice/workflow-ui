import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import moment from 'moment';
import { act } from '@testing-library/react';
import TaskPage from './TaskPage';
import ApplicationSpinner from '../../components/ApplicationSpinner';

describe('TaskPage', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('renders without crashing', () => {
    shallow(<TaskPage taskId="id" />);
  });

  it('renders loading', async () => {
    const wrapper = mount(<TaskPage taskId="id" />);
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(true);
  });

  it('renders task data', async () => {
    mockAxios.onGet('/ui/tasks/taskId')
      .reply(200, {
        task: {
          id: 'taskId',
          name: 'task name',
          due: moment(),
          priority: '1000',
          assignee: 'test',
        },
        processDefinition: {
          category: 'test',
        },
        processInstance: {
          businessKey: 'BUSINESS KEY',
        },
      });
    const wrapper = await mount(<TaskPage taskId="taskId" />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    const taskName = wrapper.find('div[id="taskName"]').at(0);
    expect(taskName.exists()).toBe(true);
    expect(taskName.text()).toContain('BUSINESS KEY');
    expect(taskName.text()).toContain('task name');

    const taskPriority = wrapper.find('div[id="taskPriority"]').at(0);
    expect(taskPriority.find('h4').at(0).text()).toBe('High');

    const taskDue = wrapper.find('div[id="taskDueDate"]').at(0);
    expect(taskDue.find('h4').at(0).text()).not.toBe('');
  });
});
