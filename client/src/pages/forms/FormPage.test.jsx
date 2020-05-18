import React from 'react';
import { shallow } from 'enzyme';
import FormPage from './FormPage';

describe('FormPage', () => {
  it('renders without crashing', () => {
    shallow(<FormPage formId="id" />);
  });
});
