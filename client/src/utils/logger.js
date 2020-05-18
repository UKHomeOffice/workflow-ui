import axios from 'axios';

class Logger {
  static info({ token, message, path }) {
    axios.post('/api/log', {
      level: 'INFO',
      message,
      path,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to post info log ${e.message}`);
    });
  }

  static error({
    token, message, path, componentStack = '',
  }) {
    axios.post('/api/log', {
      level: 'ERROR',
      message,
      path,
      componentStack,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {
      // eslint-disable-next-line no-console
      console.error(`Exception occurred ${message} <--> componentStack ${componentStack}`);
    });
  }
}

export default Logger;
