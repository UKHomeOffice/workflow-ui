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
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(200, {});
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => (
      <AlertContextProvider>
        {children}
      </AlertContextProvider>
    );
    const { result } = renderHook(() => apiHooks(), { wrapper });
    await act(async () => {
      result.current.submitForm({
        data: {
          test: 'test',
        },
      }, {
        data: {
          name: 'test',
        },
      }, 'formId', () => {});
    });
    expect(mockNavigate).toBeCalled();
  });

  it('can calls handle failure ', async () => {
    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(500, {});
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => (
      <AlertContextProvider>
        {children}
      </AlertContextProvider>
    );
    const handleFailure = jest.fn();
    const { result } = renderHook(() => apiHooks(), { wrapper });
    await act(async () => {
      result.current.submitForm({
        data: {
          test: 'test',
        },
      }, {
        data: {
          name: 'test',
        },
      }, 'formId', handleFailure);
    });

    expect(handleFailure).toBeCalled();
  });
});
