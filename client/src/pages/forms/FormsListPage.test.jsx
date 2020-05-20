import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from '@testing-library/react';
import FormsListPage from './FormsListPage';
import { mockNavigate } from '../../setupTests';

describe('FormsListPage', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders without crashing', () => {
    shallow(<FormsListPage />);
  });

  it('can render list and count', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition')
      .reply(200, [{
        id: 'id',
        name: 'name',
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

    expect(mockNavigate).toBeCalledWith('/forms/id');
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

  it('can load more', async () => {
    const mockData = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 10; i++) {
      mockData.push({
        id: `id${(Math.random() + Math.random())}`,
        name: `name${i}`,
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
});
