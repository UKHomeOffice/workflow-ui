import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import moment from 'moment';
import { act } from '@testing-library/react';
import TaskPage from './TaskPage';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import { AlertContextProvider } from '../../utils/AlertContext';
import DisplayForm from '../../components/form/DisplayForm';
import { mockNavigate } from '../../setupTests';

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
          assignee: null,
        },
        processDefinition: {
          category: 'test',
        },
        processInstance: {
          businessKey: 'BUSINESS KEY',
        },
      });
    const wrapper = await mount(<AlertContextProvider><TaskPage taskId="taskId" /></AlertContextProvider>);

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

  it('renders task data with variables', async () => {
    mockAxios.onGet('/ui/tasks/taskId')
      .reply(200, {
        form: {
          name: 'testForm',
          display: 'form',
          components: [],
        },
        task: {
          id: 'taskId',
          name: 'task name',
          due: moment(),
          priority: '1000',
          assignee: 'test',
          variables: {
            taskVariableA: {
              type: 'Json',
              value: JSON.stringify({ data: { text: 'test' } }),
            },
            testEmail: {
              value: 'test',
              type: 'string',
            },
          },
        },
        variables: {
          email: {
            value: 'test',
            type: 'string',
          },
          test: {
            type: 'Json',
            value: JSON.stringify({ data: { text: 'test' } }),
          },
          'testForm::submissionData': {
            type: 'Json',
            value: JSON.stringify({ data: { text: 'test' } }),
          },
        },
        processDefinition: {
          category: 'test',
        },
        processInstance: {
          businessKey: 'BUSINESS KEY',
        },
      });
    const wrapper = await mount(<AlertContextProvider><TaskPage taskId="taskId" /></AlertContextProvider>);

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

  it('can submit task', async () => {
    mockAxios.onGet('/ui/tasks/taskId')
      .reply(200, {
        form: {
          name: 'testForm',
          display: 'form',
          components: [],
        },
        task: {
          id: 'taskId',
          name: 'task name',
          due: moment(),
          priority: '1000',
          assignee: 'apples',
        },
        variables: {
          email: 'test',
          test: {
            type: 'Json',
            value: JSON.stringify({ data: { text: 'test' } }),
          },
          submissionData: {
            type: 'Json',
            value: JSON.stringify({ data: { text: 'test' } }),
          },
        },
        processDefinition: {
          category: 'test',
        },
        processInstance: {
          businessKey: 'BUSINESS KEY',
        },
      });

    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form')
      .reply(200, {});

    const wrapper = await mount(<AlertContextProvider><TaskPage taskId="taskId" /></AlertContextProvider>);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);

    const displayForm = wrapper.find(DisplayForm).at(0);

    expect(displayForm.exists()).toBe(true);

    await act(async () => {
      await displayForm.props().handleOnSubmit({
        data: {
          textField: 'test',
        },
      });
      await wrapper.update();
    });

    expect(mockNavigate).toBeCalledWith('/');

    await act(async () => {
      await displayForm.props().handleOnCancel();
      await wrapper.update();
    });

    expect(mockNavigate).toBeCalledWith('/');
  });

  it('adds complete button if form is not present', async () => {
    mockAxios.onGet('/ui/tasks/taskId')
      .reply(200, {
        form: null,
        task: {
          id: 'taskId',
          name: 'task name',
          due: moment(),
          priority: '1000',
          assignee: 'apples',
        },
        variables: {
          email: 'test',
          test: {
            type: 'Json',
            value: JSON.stringify({ data: { text: 'test' } }),
          },
          submissionData: {
            type: 'Json',
            value: JSON.stringify({ data: { text: 'test' } }),
          },
        },
        processDefinition: {
          category: 'test',
        },
        processInstance: {
          businessKey: 'BUSINESS KEY',
        },
      });

    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form')
      .reply(200, {});

    const wrapper = await mount(<AlertContextProvider><TaskPage taskId="taskId" /></AlertContextProvider>);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);

    const completeButton = wrapper.find('button').at(0);

    expect(completeButton.exists()).toBe(true);

    await act(async () => {
      await completeButton.simulate('click');
      await wrapper.update();
    });

    expect(mockNavigate).toBeCalledWith('/');
  });
});
