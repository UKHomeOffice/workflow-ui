import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from '@testing-library/react';
import _ from 'lodash';
import FormsListPage from './FormsListPage';
import { mockNavigate } from '../../setupTests';

jest.mock('lodash', () => ({
  ...require.requireActual('lodash'),
  // eslint-disable-next-line no-param-reassign
  debounce: (fn) => { fn.cancel = jest.fn(); return fn; },
}));

describe('FormsListPage', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('renders without crashing', () => {
    shallow(<FormsListPage />);
  });

  it('can render list and count', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition')
      .reply(200, [{
        id: 'id',
        name: 'name',
        key: 'key',
      }]);

    mockAxios.onGet('/camunda/engine-rest/process-definition/count')
      .reply(200, {
        count: 1,
      });

    const wrapper = mount(<FormsListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });
    expect(wrapper.find('h2').at(0).text()).not.toBe('');

    wrapper.find('a').at(0).simulate('click', {
      preventDefault: () => {},
    });

    expect(mockNavigate).toBeCalledWith('/forms/key');
  });

  it('can handle exception in loading', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition')
      .reply(500);

    const wrapper = mount(<FormsListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find('h2').at(0).text()).not.toBe('');
  });

  it('load more does not exist if results less than 20', async () => {
    const mockData = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 4; i++) {
      mockData.push({
        id: `id${(Math.random() + Math.random())}`,
        name: `name${i}`,
        key: `key${i}`,
      });
    }

    mockAxios.onGet('/camunda/engine-rest/process-definition')
      .reply(200, mockData);

    mockAxios.onGet('/camunda/engine-rest/process-definition/count')
      .reply(200, {
        count: 4,
      });

    const wrapper = mount(<FormsListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find('a[id="loadMore"]').exists()).toBe(false);
  });

  it('can load more', async () => {
    const mockData = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 10; i++) {
      mockData.push({
        id: `id${(Math.random() + Math.random())}`,
        name: `name${i}`,
        key: `key${i}`,
      });
    }

    mockAxios.onGet('/camunda/engine-rest/process-definition')
      .reply(200, mockData);

    mockAxios.onGet('/camunda/engine-rest/process-definition/count')
      .reply(200, {
        count: 40,
      });

    const wrapper = mount(<FormsListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    const loadMore = wrapper.find('a[id="loadMore"]').at(0);

    await act(async () => {
      await loadMore.simulate('click', {
        preventDefault: () => {},
      });
      await wrapper.update();
    });
  });

  it('can perform a search', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition')
      .reply(200, []);

    mockAxios.onGet('/camunda/engine-rest/process-definition/count')
      .reply(200, {
        count: 0,
      });

    const wrapper = mount(<FormsListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    const search = wrapper.find('input[id="search"]').at(0);
    expect(search).toBeDefined();
    await act(async () => {
      await search.simulate('change', {
        target: {
          value: 'test',
        },
      });
      await wrapper.update();
    });

    const queryAxiosCall = _.find(mockAxios.history.get, (call) => call.params.nameLike === '%test%');

    expect(queryAxiosCall).toBeDefined();
  });
});
