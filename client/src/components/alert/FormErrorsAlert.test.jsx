import React from 'react';
import { mount } from 'enzyme';
import { Form } from 'react-formio';
import { act } from '@testing-library/react';
import FormErrorsAlert from './FormErrorsAlert';

describe('FormErrorsAlert', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    // eslint-disable-next-line no-console
    console.warn = jest.fn();
  });
  it('renders without crashing', async () => {
    const form = mount(
      <Form
        form={{
          display: 'form',
          components: [{
            key: 'textField',
            type: 'textfield',
          }],
        }}
      />,
    );
    mount(<FormErrorsAlert errors={[]} form={form.instance()} />);
  });

  it('displays form errors', async () => {
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

    const wrapper = mount(<FormErrorsAlert
      errors={[{
        component: {
          id: 'id',
          key: 'textField',
        },
        message: 'Textfield is required',
      }]}
      form={form.instance()}
    />);

    const message = wrapper.find('div[id="message"]').at(0);
    expect(message.text()).toBe('Textfield is required');

    const errorLink = wrapper.find('a').at(0);
    errorLink.simulate('click', {
      preventDefault: () => {},
    });

    const focusedElement = document.activeElement;
    expect(focusedElement.name).toBe('data[textField]');
  });
});
