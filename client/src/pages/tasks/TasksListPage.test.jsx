import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from '@testing-library/react';
import TasksListPage from './TasksListPage';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import TaskList from './components/TaskList';

describe('TasksListPage', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('renders without crashing', () => {
    shallow(<TasksListPage />);
  });

  it('renders application spinner when getting data', async () => {
    const wrapper = await mount(<TasksListPage />);
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(true);
  });

  it('renders a list of tasks', async () => {
    mockAxios.onGet('/camunda/engine-rest/task')
      .reply(200, [{
        id: 'id',
        name: 'name',
      }]);

    mockAxios.onPost('/camunda/engine-rest/task/count')
      .reply(200, {
        count: 1,
      });

    const wrapper = await mount(<TasksListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(TaskList).exists()).toBe(true);
  });

  it('can click on load more', async () => {
    const mockData = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 10; i++) {
      mockData.push({
        id: `id${(Math.random() + Math.random())}`,
        name: `name${i}`,
        processDefinitionId: 'processDefinitionId0',
      });
    }

    mockAxios.onGet('/camunda/engine-rest/process-definition')
      .reply(200, [{
        category: 'test',
        id: 'processDefinitionId0',
      }]);

    mockAxios.onPost('/camunda/engine-rest/task')
      .reply(200, mockData);

    mockAxios.onPost('/camunda/engine-rest/task/count')
      .reply(200, {
        count: 100,
      });

    const wrapper = await mount(<TasksListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find('a[id="loadMore"]').exists()).toBe(true);

    await act(async () => {
      await wrapper.find('a[id="loadMore"]').at(0).simulate('click', {
        preventDefault: () => {},
      });

      await wrapper.update();
    });

    expect(mockAxios.history.get.length).toBe(2);
    expect(mockAxios.history.post.length).toBe(4);
  });
});
