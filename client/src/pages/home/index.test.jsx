import { shallow, mount } from 'enzyme';
import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { act } from '@testing-library/react';
import Home from './index';
import Card from './components/Card';
import { mockNavigate } from '../../setupTests';

describe('Home', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  const mockAxios = new MockAdapter(axios);
  it('renders without crashing', () => {
    shallow(<Home />);
  });

  it('renders forms and tasks panels', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/count')
      .reply(200, {
        count: 10,
      });

    mockAxios.onPost('/camunda/engine-rest/task/count')
      .reply(200, {
        count: 10,
      });

    const wrapper = mount(<Home />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(Card).length).toBe(2);
    const formsCard = wrapper.find(Card).at(0);
    const tasksCard = wrapper.find(Card).at(1);

    expect(formsCard.find('span[id="count"]').text()).toBe('10');
    expect(tasksCard.find('span[id="count"]').text()).toBe('10');
  });

  it('handles errors and sets it to zero', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/count')
      .reply(500, {});

    mockAxios.onPost('/camunda/engine-rest/task/count')
      .reply(500, {});

    const wrapper = mount(<Home />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(Card).length).toBe(2);
    const formsCard = wrapper.find(Card).at(0);
    const tasksCard = wrapper.find(Card).at(1);

    expect(formsCard.find('span[id="count"]').text()).toBe('0');
    expect(tasksCard.find('span[id="count"]').text()).toBe('0');
  });

  it('can handle onlick', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/count')
      .reply(200, {
        count: 10,
      });

    mockAxios.onPost('/camunda/engine-rest/task/count')
      .reply(200, {
        count: 10,
      });
    const wrapper = await mount(<Home />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    const formsCard = wrapper.find(Card).at(0);
    const tasksCard = wrapper.find(Card).at(1);

    formsCard.props().handleClick();
    expect(mockNavigate).toBeCalledWith('/forms');

    tasksCard.props().handleClick();
    expect(mockNavigate).toBeCalledWith('/tasks');
  });
});
