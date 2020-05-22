import React, { useContext } from 'react';
import { mount } from 'enzyme';
import { act } from '@testing-library/react';
import { SubmissionContext, SubmissionContextProvider } from '../utils/SubmissionContext';
import SubmissionConfirmation from './SubmissionConfirmation';

describe('SubmissionConfirmation', () => {
  it('renders nothing if context is empty', async () => {
    const wrapper = await mount(
      <SubmissionContextProvider>
        <SubmissionConfirmation />
      </SubmissionContextProvider>,
    );
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('renders submission', async () => {
    const TestComponent = () => {
      const { updateSubmissionContext } = useContext(SubmissionContext);

      return (
        <div>
          <button
            type="button"
            onClick={() => {
              updateSubmissionContext({
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
      <SubmissionContextProvider>
        <SubmissionConfirmation />
        <TestComponent />
      </SubmissionContextProvider>,
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
});
