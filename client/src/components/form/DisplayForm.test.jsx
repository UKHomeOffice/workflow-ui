import React from 'react';
import { mount } from 'enzyme';
import { act } from '@testing-library/react';

import DisplayForm from './DisplayForm';
import { AlertContextProvider } from '../../utils/AlertContext';
import AlertBanner from '../alert/AlertBanner';

describe('Display form', () => {
  it('renders overlay when form is being submitted', async () => {
    const wrapper = await mount(
      <AlertContextProvider>
        <AlertBanner />
        <DisplayForm
          form={{
            name: 'test',
            display: 'form',
            id: 'id',
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
              },
            ],
          }}
          submitting
          handleOnCancel={jest.fn()}
          handleOnSubmit={jest.fn()}
        />
      </AlertContextProvider>,
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
      await wrapper.update();
    });

    const loader = wrapper.find('.Loader').at(0);
    expect(loader.exists()).toBe(true);
    const loaderContext = wrapper.find('.Loader__content');
    expect(loaderContext.prop('style')).toHaveProperty('opacity', 1);
  });
});
