import React from 'react';
import { shallow } from 'enzyme';
import ApiErrorAlert from './ApiErrorAlert';

describe('ApiErrorAlert', () => {
  it('renders nothing if no errors', () => {
    const wrapper = shallow(<ApiErrorAlert errors={[]} />);
    expect(wrapper.find('div').length).toBe(0);
  });

  it.each`
      status          | message                     | path
      ${409}          | ${''}                       | ${'/api/test'}
      ${404}          | ${'data does not exist'}    | ${'/api/test'}
      ${401}          | ${'unauthorized'}           | ${'/api/test'}
      ${400}          | ${'bad data'}               | ${'/api/test'}
      ${500}          | ${'internal'}               | ${'/api/test'}  
    `('error displayed for $status', async ({ status, message, path }) => {
  const wrapper = shallow(<ApiErrorAlert errors={[{
    status,
    message,
    path,
  }]}
  />);
  expect(wrapper.find('.govuk-error-summary__title').exists()).toBe(true);
});
});
