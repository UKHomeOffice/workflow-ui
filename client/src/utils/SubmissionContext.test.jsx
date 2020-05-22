
import React from 'react';
import { mount } from 'enzyme';
import { SubmissionContextProvider } from './SubmissionContext';

describe('SubmissionContext', () => {
  it('can render components without crashing', async () => {
    const wrapper = await mount(
      <SubmissionContextProvider><div>Hello</div></SubmissionContextProvider>,
    );
    expect(wrapper).toBeDefined();
  });
});
