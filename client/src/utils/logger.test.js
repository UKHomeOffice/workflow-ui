import axios from 'axios';
import Logger from './logger';

jest.mock('axios');

describe('Logger', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    // eslint-disable-next-line no-console
    console.error('');
  });

  it('can log info', async () => {
    axios.post.mockImplementation(() => Promise.resolve());
    Logger.info({
      token: 'token',
      message: 'message',
      path: 'path',
    });
    expect(axios.post).toBeCalled();
  });
  it('console error if failed to log', async () => {
    axios.post.mockImplementation(() => Promise.reject(new Error('Failed')));
    Logger.info({
      token: 'token',
      message: 'message',
      path: 'path',
    });
    expect(axios.post).toBeCalled();
    // eslint-disable-next-line no-console
    expect(console.error).toBeCalled();
  });

  it('can log error', async () => {
    axios.post.mockImplementation(() => Promise.resolve());
    Logger.error({
      token: 'token',
      message: 'message',
      path: 'path',
      componentStack: 'test',
    });
    expect(axios.post).toBeCalled();
  });
  it('error logged on console if failed to post', async () => {
    axios.post.mockImplementation(() => Promise.reject(new Error('Failed')));
    Logger.error({
      token: 'token',
      message: 'message',
      path: 'path',
      componentStack: 'test',
    });
    expect(axios.post).toBeCalled();
    // eslint-disable-next-line no-console
    expect(console.error).toBeCalled();
  });
});
