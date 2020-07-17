import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderHook } from '@testing-library/react-hooks';
import { useAxios, useIsMounted } from './hooks';
import Logger from './logger';

jest.mock('./logger', () => ({
  error: jest.fn(),
}));

jest.mock('react', () => {
  const ActualReact = require.requireActual('react');
  return {
    ...ActualReact,
    useContext: () => ({ setAlertContext: jest.fn() }),
  };
});

describe('axios hooks', () => {
  const mockAxios = new MockAdapter(axios);
  it('can perform a API call', async () => {
    mockAxios.onGet('/api/data').reply(200, [{ id: 'test' }]);
    const axiosInstance = renderHook(() => useAxios());

    const result = await axiosInstance.result.current.get('/api/data');
    expect(result.status).toBe(200);
    expect(result.data.length).toBe(1);
  });

  it('can log error to server if api call fails', async () => {
    mockAxios.onGet('/api/data').reply(500, {});
    const axiosInstance = renderHook(() => useAxios());

    try {
      await axiosInstance.result.current.get('/api/data');
    } catch (e) {
      expect(Logger.error).toBeCalled();
    }
  });

  it('can mount', () => {
    const mounted = renderHook(() => useIsMounted());

    expect(mounted.result.current.current).toBe(true);

    mounted.unmount();

    expect(mounted.result.current.current).toBe(false);
  });
});
