import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import FileService from './FileService';

describe('FileService', () => {
  const mockAxios = new MockAdapter(axios);
  const consoleError = jest.fn();
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(consoleError);
  });

  let fileService = beforeEach(() => {
    const keycloak = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      clientId: 'clientId',
      refreshToken: 'refreshToken',
      realm: 'realm',
      authServerUrl: '/auth',
    };

    fileService = new FileService(keycloak);

    mockAxios.reset();
  });

  it('can upload file', async () => {
    mockAxios.onPost('/files/TEST').reply((config) => {
      config.onUploadProgress({ loaded: 1, total: 1 });
      return [200, {
        url: 'url',
      }];
    });

    const result = await fileService.uploadFile(
      'url',
      {
        size: 100,
        type: 'file',
      },
      'fileName',
      null,
      () => {},
      '/files/TEST',
      {},
    );

    expect(result).toBeDefined();
    expect(mockAxios.history.post.length).toBe(1);
  });

  it('can request new token if token expired', async () => {
    fileService.keycloak.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1OTE1OTk3OTZ9.Ffv7hdB55i6ksTd9NFCWjaSIaMVhNyZMVHA6uuUA7RU';

    mockAxios.onPost('/files/TEST').reply(201, {
      url: 'url',
    });

    mockAxios.onPost('/auth/realms/realm/protocol/openid-connect/token').reply(201, {
      access_token: 'new-token',
    });

    const result = await fileService.uploadFile(
      'url',
      {
        size: 100,
        type: 'file',
      },
      'fileName',
      null,
      {},
      '/files/TEST',
      {},
    );

    expect(result).toBeDefined();
    expect(mockAxios.history.post.length).toBe(2);
  });

  it('logs console error if refresh token fails', async () => {
    fileService.keycloak.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1OTE1OTk3OTZ9.Ffv7hdB55i6ksTd9NFCWjaSIaMVhNyZMVHA6uuUA7RU';

    mockAxios.onPost('/files/TEST').reply(201, {
      url: 'url',
    });

    mockAxios.onPost('/auth/realms/realm/protocol/openid-connect/token').reply(500, {
      access_token: 'new-token',
    });

    await fileService.uploadFile(
      'url',
      {
        size: 100,
        type: 'file',
      },
      'fileName',
      null,
      {},
      '/files/TEST',
      {},
    );

    expect(consoleError).toBeCalled();
  });

  it('can delete a file', async () => {
    const fileInfo = {
      url: '/files/test/file.pdf',
    };
    mockAxios.onDelete('/files/test/file.pdf').reply(200, {
      url: 'url',
    });
    const result = await fileService.deleteFile(fileInfo);

    expect(mockAxios.history.delete.length).toBe(1);
    expect(result).toBeDefined();
    expect(result).toBe('File deleted');
  });

  it('promise rejected if file cannot be deleted', (done) => {
    const fileInfo = {
      url: '/files/test/file.pdf',
    };
    mockAxios.onDelete('/files/test/file.pdf').reply(500, {});
    fileService.deleteFile(fileInfo).catch((e) => {
      expect(mockAxios.history.delete.length).toBe(1);
      expect(e).toBeDefined();
      expect(e).toBe('Request failed with status code 500');
      done();
    });
  });

  it('can download file', (done) => {
    mockAxios.onGet('/file').reply(200, {
      url: 'url',
    });

    fileService.downloadFile({
      url: 'file',
      originalName: 'file',
    }).then(() => {
      expect(mockAxios.history.get.length).toBe(1);
      done();
    });
  });
  it('error thrown if cannot download file', (done) => {
    mockAxios.onGet('/file').reply(500, {
      url: 'url',
    });

    fileService.downloadFile({
      url: 'file',
      originalName: 'file',
    }).catch((e) => {
      expect(mockAxios.history.get.length).toBe(1);
      expect(e.message).toBe('Request failed with status code 500');
      done();
    });
  });
});
