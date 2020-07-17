import React from 'react';
import { mount } from 'enzyme';
import { AlertContextProvider } from './AlertContext';

describe('Alert', () => {
  it('can render components without crashing', async () => {
    const wrapper = await mount(
      <AlertContextProvider><div>Hello</div></AlertContextProvider>,
    );
    expect(wrapper).toBeDefined();
  });
});
