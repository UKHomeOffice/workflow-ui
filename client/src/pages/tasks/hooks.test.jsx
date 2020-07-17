import axios from 'axios';
import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import apiHooks from './hooks';
import { mockNavigate } from '../../setupTests';
import { AlertContextProvider } from '../../utils/AlertContext';

jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
}));

describe('hooks', () => {
  const mockAxios = new MockAdapter(axios);

  it('can handle submit', async () => {
    mockAxios
      .onPost('/camunda/engine-rest/task/taskId/submit-form')
      .reply(200, {});
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => (
      <AlertContextProvider>
        {children}
      </AlertContextProvider>
    );
    const { result } = renderHook(() => apiHooks(), { wrapper });

    const submission = {
      data: {
        textField: 'test',
      },
    };

    const form = { name: 'formName', id: 'formId' };

    const taskId = 'taskId';

    const businessKey = 'businesskey';

    await act(async () => {
      result.current.submitForm({
        submission, form, taskId, businessKey, handleOnFailure: () => {},
      });
    });
    expect(mockNavigate).toBeCalled();
  });

  it('can handle failure', async () => {
    mockAxios
      .onPost('/camunda/engine-rest/task/taskId/submit-form')
      .reply(500, {});
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => (
      <AlertContextProvider>
        {children}
      </AlertContextProvider>
    );
    const { result } = renderHook(() => apiHooks(), { wrapper });

    const submission = {
      data: {
        textField: 'test',
      },
    };

    const form = { name: 'formName', id: 'formId' };

    const taskId = 'taskId';

    const businessKey = 'businesskey';
    const handleOnFailure = jest.fn();

    await act(async () => {
      result.current.submitForm({
        submission, form, taskId, businessKey, handleOnFailure,
      });
    });

    expect(handleOnFailure).toBeCalled();
  });
});
