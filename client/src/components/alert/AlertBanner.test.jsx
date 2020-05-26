import React, { useContext } from 'react';
import { mount } from 'enzyme';
import { act } from '@testing-library/react';
import { Form } from 'react-formio';
import { AlertContext, AlertContextProvider } from '../../utils/AlertContext';
import AlertBanner from './AlertBanner';
import ApiErrorAlert from './ApiErrorAlert';
import FormErrorsAlert from './FormErrorsAlert';

describe('AlertBanner', () => {
  it('renders nothing if context is empty', async () => {
    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
      </AlertContextProvider>,
    );
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('renders nothing if alert type unknown', async () => {
    const TestComponent = () => {
      const { setAlertContext } = useContext(AlertContext);

      return (
        <div>
          <button
            type="button"
            onClick={() => {
              setAlertContext({
                type: 'random',
                message: 'test',
                reference: 'text',
                status: 'successful',
              });
            }}
          >
            Trigger
          </button>
        </div>
      );
    };
    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
        <TestComponent />
      </AlertContextProvider>,
    );
    await act(async () => {
      await wrapper.find('button').at(0).simulate('click');
      await wrapper.update();
    });
    const alert = wrapper.find(AlertBanner).at(0);
    expect(alert.find('div').length).toBe(0);
  });

  it('renders submission', async () => {
    const TestComponent = () => {
      const { setAlertContext } = useContext(AlertContext);

      return (
        <div>
          <button
            type="button"
            onClick={() => {
              setAlertContext({
                type: 'form-submission',
                message: 'test',
                reference: 'text',
                status: 'successful',
              });
            }}
          >
            Trigger
          </button>
        </div>
      );
    };
    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
        <TestComponent />
      </AlertContextProvider>,
    );
    expect(wrapper.find('.govuk-panel--confirmation').exists()).toBe(false);

    await act(async () => {
      await wrapper.find('button').at(0).simulate('click');
      await wrapper.update();
    });
    expect(wrapper.find('.govuk-panel--confirmation').exists()).toBe(true);

    await act(async () => {
      await wrapper.find('button[id="closeConfirmation"]').at(0).simulate('click');
      await wrapper.update();
    });

    expect(wrapper.find('.govuk-panel--confirmation').exists()).toBe(false);
  });

  it('renders api alert error', async () => {
    const TestComponent = () => {
      const { setAlertContext } = useContext(AlertContext);

      return (
        <div>
          <button
            type="button"
            onClick={() => {
              setAlertContext({
                type: 'api-error',
                errors: [{
                  status: 400,
                  message: 'missing',
                  path: '/api/test',
                }],
              });
            }}
          >
            Trigger
          </button>
        </div>
      );
    };
    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
        <TestComponent />
      </AlertContextProvider>,
    );
    await act(async () => {
      await wrapper.find('button').at(0).simulate('click');
      await wrapper.update();
    });

    expect(wrapper.find(ApiErrorAlert).exists()).toBe(true);
  });

  it('renders form alert error', async () => {
    const form = await mount(
      <Form
        form={{
          display: 'form',
          components: [{
            key: 'textField',
            type: 'textfield',
            id: 'id',
          }],
        }}
      />,
    );

    await act(async () => {
      await Promise.resolve(form);
      await new Promise((resolve) => setImmediate(resolve));
      await form.update();
    });

    await form.instance().createPromise;
    const TestComponent = () => {
      const { setAlertContext } = useContext(AlertContext);

      return (
        <div>
          <button
            type="button"
            onClick={() => {
              setAlertContext({
                type: 'form-error',
                form: form.instance(),
                errors: [{
                  component: {
                    id: 'id',
                    key: 'textField',
                  },
                  message: 'Textfield is required',
                }],
              });
            }}
          >
            Trigger
          </button>
        </div>
      );
    };
    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
        <TestComponent />
      </AlertContextProvider>,
    );
    await act(async () => {
      await wrapper.find('button').at(0).simulate('click');
      await wrapper.update();
    });

    expect(wrapper.find(FormErrorsAlert).exists()).toBe(true);
  });
});
