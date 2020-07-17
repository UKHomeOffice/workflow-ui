import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { augmentRequest, interpolate } from './formioSupport';
import Logger from './logger';

jest.mock('./logger', () => ({
  error: jest.fn(),
}));

describe('formio support', () => {
  it('can interpolate file url', () => {
    const form = {
      components: [{
        type: 'file',
        url: '{{data.environmentContext.uploadUrl}}/files/{{data.businessKey}}',
      }],
    };
    const data = {
      environmentContext: {
        uploadUrl: 'http://localhost:8080/api/attachment',
      },
      businessKey: 'businessKey',
    };
    interpolate(form, data);
    expect(form.components[0].url).toEqual('http://localhost:8080/api/attachment/files/businessKey');
  });
  it('can interpolate select url', () => {
    const form = {
      components: [{
        type: 'select',
        data: {
          url: '{{data.environmentContext.apiUrl}}/api/data',
        },
      }],
    };
    const data = {
      environmentContext: {
        apiUrl: 'http://localhost:8080',
      },
    };
    interpolate(form, data);
    expect(form.components[0].data.url).toEqual('http://localhost:8080/api/data');
  });
  it('can interpolate label', () => {
    const form = {
      components: [{
        label: '{{data.businessKey}} hello',
      }],
    };
    const data = {
      businessKey: 'apples',
    };
    interpolate(form, data);
    expect(form.components[0].label).toEqual('apples hello');
  });
  it('can interpolate html content', () => {
    const form = {
      components: [{
        type: 'content',
        html: '<p>Your reference {{data.businessKey}}</p>',
      }],
    };
    const data = {
      businessKey: 'businessKey',
    };
    interpolate(form, data);
    expect(form.components[0].html).toEqual('<p>Your reference businessKey</p>');
  });

  it('can interpolate html element', () => {
    const form = {
      components: [{
        type: 'htmlelement',
        content: '<p>Your reference {{data.businessKey}}</p>',
      }],
    };
    const data = {
      businessKey: 'businessKey',
    };
    interpolate(form, data);
    expect(form.components[0].content).toEqual('<p>Your reference businessKey</p>');
  });

  it('can interpolate defaultValue', () => {
    const form = {
      components: [{
        defaultValue: '{{data.businessKey}}',
      }],
    };
    const data = {
      businessKey: 'businessKey',
    };
    interpolate(form, data);
    expect(form.components[0].defaultValue).toEqual('businessKey');
  });
  it('can interpolate customDefaultValue', () => {
    const form = {
      components: [{
        defaultValue: '',
        customDefaultValue: 'value = data.businessKey',
      }],
    };
    const data = {
      businessKey: 'businessKey',
    };
    interpolate(form, data);
    expect(form.components[0].defaultValue).toEqual('businessKey');
  });

  it('can augment request', async () => {
    const plugin = augmentRequest({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    }, 'formId');
    const requestArgs = {};
    await plugin.preRequest(requestArgs);
    expect(requestArgs).toBeDefined();
    expect(requestArgs.opts.header.get('authorization')).toBeDefined();
  });

  it('can handle file', async () => {
    const plugin = augmentRequest({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    }, 'formId');
    const requestArgs = {
      opts: {

      },
      file: {
        type: 'application/json',
      },
      method: 'upload',
    };
    await plugin.preRequest(requestArgs);
    expect(requestArgs).toBeDefined();
    expect(requestArgs.opts.header.get('content-type')).toBe('application/json');
  });

  it('can handle when token expired', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost(new RegExp('/realms/test/protocol/openid-connect/token*')).reply(200, {
      access_token: 'new-access-token',
    });

    const plugin = augmentRequest({
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTAwNTk2NDksImV4cCI6MTU1ODQzNzI0OSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20ifQ.LQdevf8dw6r1XrJIHfocqlcaX95mCPNvsg0ztl6Bvaw',
      authServerUrl: 'test',
      realm: 'test',
      clientId: 'client',
      refreshToken: 'refreshToken',
    }, 'formId');
    const requestArgs = {};
    await plugin.preRequest(requestArgs);
    expect(requestArgs).toBeDefined();
    expect(requestArgs.opts.header.get('authorization')).toBeDefined();
  });

  it('logs error if unable to get token', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost(new RegExp('/realms/test/protocol/openid-connect/token*')).reply(500, {});

    const plugin = augmentRequest({
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTAwNTk2NDksImV4cCI6MTU1ODQzNzI0OSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20ifQ.LQdevf8dw6r1XrJIHfocqlcaX95mCPNvsg0ztl6Bvaw',
      authServerUrl: 'test',
      realm: 'test',
      clientId: 'client',
      refreshToken: 'refreshToken',
    }, 'formId');
    const requestArgs = {};
    await plugin.preRequest(requestArgs);
    expect(Logger.error).toBeCalled();
  });
});
