import axios from 'axios';
import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import apiHooks from './hooks';
import { mockNavigate } from '../../setupTests';
import { SubmissionContextProvider } from '../../utils/SubmissionContext';

describe('hooks', () => {
  const mockAxios = new MockAdapter(axios);
  mockAxios
    .onPost('/camunda/engine-rest/process-definition/formId/submit-form')
    .reply(200, {});
  it('can handle submit', async () => {
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => (
      <SubmissionContextProvider>
        {children}
      </SubmissionContextProvider>
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
      }, 'formId');
    });
    expect(mockNavigate).toBeCalled();
  });
});
