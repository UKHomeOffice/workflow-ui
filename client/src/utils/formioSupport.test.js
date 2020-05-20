import { interpolate } from './formioSupport';

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
});
