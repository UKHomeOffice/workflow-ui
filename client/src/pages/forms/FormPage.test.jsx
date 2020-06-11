import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from '@testing-library/react';
import { Form } from 'react-formio';
import FormPage from './FormPage';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import { mockNavigate } from '../../setupTests';
import Logger from '../../utils/logger';
import AlertBanner from '../../components/alert/AlertBanner';
import { AlertContextProvider } from '../../utils/AlertContext';
import FormErrorsAlert from '../../components/alert/FormErrorsAlert';

jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
}));

const mockSubmitForm = jest.fn();

jest.mock('./hooks', () => () => ({
  submitForm: mockSubmitForm,
}));

describe('FormPage', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('renders without crashing', () => {
    shallow(<FormPage formId="id" />);
  });

  it('renders loading when fetching form', () => {
    const wrapper = shallow(<FormPage formId="id" />);
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(true);
  });

  it('renders a loading', async () => {
    const wrapper = mount(<FormPage formId="id" />);
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(true);
  });

  it('loads form', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/key/id/startForm')
      .reply(200, {
        key: 'formKey',
      });

    mockAxios.onGet('/form/name/formKey')
      .reply(200, {
        name: 'test',
        display: 'form',
        components: [],
      });

    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
        <FormPage formId="id" />
      </AlertContextProvider>,
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    expect(wrapper.find(Form).exists()).toBe(true);
  });

  it('form does not exist handles gracefully', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/key/id/startForm')
      .reply(200, null);

    const wrapper = mount(<FormPage formId="id" />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    expect(mockAxios.history.get.length).toBe(1);
  });

  it('can submit the form', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/key/id/startForm')
      .reply(200, {
        key: 'formKey',
      });

    mockAxios.onGet('/form/name/formKey')
      .reply(200, {
        name: 'test',
        display: 'form',
        versionId: 'version',
        title: 'title',
        components: [
          {
            id: 'eoduazt',
            key: 'textField1',
            case: '',
            mask: false,
            tags: '',
            type: 'textfield',
            input: true,
            label: 'Text Field',
            logic: [],
            hidden: false,
            prefix: '',
            suffix: '',
            unique: false,
            widget: {
              type: 'input',
            },
          },
          {
            id: 'e23op57',
            key: 'submit',
            size: 'md',
            type: 'button',
            block: false,
            input: true,
            label: 'Submit',
            theme: 'primary',
            action: 'submit',
            hidden: false,
            prefix: '',
            suffix: '',
            unique: false,
            widget: {
              type: 'input',
            },
          }],
      });

    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
        <FormPage formId="id" />
      </AlertContextProvider>,
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);

    const form = wrapper.find(Form).at(0);
    const next = jest.fn();
    const submission = {
      data: {},
    };
    form.props().options.hooks.beforeSubmit(submission, next);
    expect(submission.data.form.formVersionId).toBe('version');

    form.props().options.hooks.beforeCancel();
    expect(mockNavigate).toBeCalledWith('/forms');
  });

  it('expect form time to be logged', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/key/id/startForm')
      .reply(200, {
        key: 'formKey',
      });

    mockAxios.onGet('/form/name/formKey')
      .reply(200, {
        name: 'test',
        display: 'form',
        versionId: 'version',
        title: 'title',
        components: [
          {
            id: 'eoduazt',
            key: 'textField1',
            case: '',
            mask: false,
            tags: '',
            type: 'textfield',
            input: true,
            label: 'Text Field',
            logic: [],
            hidden: false,
            prefix: '',
            suffix: '',
            unique: false,
            widget: {
              type: 'input',
            },
          },
          {
            id: 'e23op57',
            key: 'submit',
            size: 'md',
            type: 'button',
            block: false,
            input: true,
            label: 'Submit',
            theme: 'primary',
            action: 'submit',
            hidden: false,
            prefix: '',
            suffix: '',
            unique: false,
            widget: {
              type: 'input',
            },
          }],
      });

    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
        <FormPage formId="id" />
      </AlertContextProvider>,
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    const form = wrapper.find(Form).at(0);
    const formProps = form.props();
    formProps.onSubmit();

    expect(Logger.info).toBeCalled();
    expect(mockSubmitForm).toBeCalled();
  });

  it('renders error on form', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/key/id/startForm')
      .reply(200, {
        key: 'formKey',
      });

    mockAxios.onGet('/form/name/formKey')
      .reply(200, {
        name: 'test',
        display: 'form',
        versionId: 'version',
        title: 'title',
        components: [
          {
            id: 'eoduazt',
            key: 'textField1',
            case: '',
            mask: false,
            tags: '',
            type: 'textfield',
            input: true,
            label: 'Text Field',
            logic: [],
            hidden: false,
            prefix: '',
            suffix: '',
            unique: false,
            validate: {
              json: '',
              custom: '',
              unique: false,
              pattern: '',
              multiple: false,
              required: true,
              maxLength: '',
              minLength: '',
              customMessage: '',
              customPrivate: false,
              strictDateValidation: false,
            },
            widget: {
              type: 'input',
            },
          },
          {
            id: 'e23op57',
            key: 'submit',
            size: 'md',
            type: 'button',
            block: false,
            input: true,
            label: 'Submit',
            theme: 'primary',
            action: 'submit',
            hidden: false,
            prefix: '',
            suffix: '',
            unique: false,
            widget: {
              type: 'input',
            },
          }],
      });

    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
        <FormPage formId="id" />
      </AlertContextProvider>,
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    const form = wrapper.find(Form).at(0);
    await form.instance().createPromise;
    form.instance().props.onError([{
      component: {
        id: 'id',
        key: 'textField',
      },
      message: 'Textfield is required',
    }]);

    await act(async () => {
      await wrapper.update();
    });

    expect(wrapper.find(FormErrorsAlert).exists()).toBe(true);
  });

  it('clears alert box if no more errors', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/key/id/startForm')
      .reply(200, {
        key: 'formKey',
      });

    mockAxios.onGet('/form/name/formKey')
      .reply(200, {
        name: 'test',
        display: 'form',
        versionId: 'version',
        title: 'title',
        components: [
          {
            id: 'eoduazt',
            key: 'textField1',
            case: '',
            mask: false,
            tags: '',
            type: 'textfield',
            input: true,
            label: 'Text Field',
            logic: [],
            hidden: false,
            prefix: '',
            suffix: '',
            unique: false,
            validate: {
              json: '',
              custom: '',
              unique: false,
              pattern: '',
              multiple: false,
              required: true,
              maxLength: '',
              minLength: '',
              customMessage: '',
              customPrivate: false,
              strictDateValidation: false,
            },
            widget: {
              type: 'input',
            },
          },
          {
            id: 'eoduazg',
            key: 'textField2',
            case: '',
            mask: false,
            tags: '',
            type: 'textfield',
            input: true,
            label: 'Text Field',
            logic: [],
            hidden: false,
            prefix: '',
            suffix: '',
            unique: false,
            validate: {
              json: '',
              custom: '',
              unique: false,
              pattern: '',
              multiple: false,
              required: true,
              maxLength: '',
              minLength: '',
              customMessage: '',
              customPrivate: false,
              strictDateValidation: false,
            },
            widget: {
              type: 'input',
            },
          },
          {
            id: 'e23op57',
            key: 'submit',
            size: 'md',
            type: 'button',
            block: false,
            input: true,
            label: 'Submit',
            theme: 'primary',
            action: 'submit',
            hidden: false,
            prefix: '',
            suffix: '',
            unique: false,
            widget: {
              type: 'input',
            },
          }],
      });
    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
        <FormPage formId="id" />
      </AlertContextProvider>,
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    const form = wrapper.find(Form).at(0);
    await form.instance().createPromise;

    form.instance().props.onError([{
      component: {
        id: 'eoduazt',
        key: 'textField1',
      },
      message: 'Textfield is required',
    },
    {
      component: {
        id: 'eoduazg',
        key: 'textField2',
      },
      message: 'Textfield is required',
    }]);

    await act(async () => {
      await wrapper.update();
    });

    expect(wrapper.find(FormErrorsAlert).exists()).toBe(true);
    form.instance().props.onChange({
      changed: {
        component: {
          id: 'eoduazt',
          key: 'textField1',
        },
        isValid: true,
      },
    });

    expect(wrapper.find(FormErrorsAlert).exists()).toBe(true);

    form.instance().props.onChange({
      changed: {
        component: {
          id: 'eoduazg',
          key: 'textField2',
        },
        isValid: true,
      },
    });
    await act(async () => {
      await wrapper.update();
    });
    expect(wrapper.find(FormErrorsAlert).exists()).toBe(false);
  });
});
