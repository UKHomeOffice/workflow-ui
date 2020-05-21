import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from '@testing-library/react';
import { Form } from 'react-formio';
import FormPage from './FormPage';
import ApplicationSpinner from '../../components/ApplicationSpinner';

describe('FormPage', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('renders without crashing', () => {
    shallow(<FormPage formId="id" />);
  });

  it('renders loading when fetching form', () => {
    const wrapper = shallow(<FormPage formId="id" />);
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(true);
  });

  it('renders a loading', async () => {
    const wrapper = mount(<FormPage formId="id" />);
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(true);
  });

  it('loads form', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/id/startForm')
      .reply(200, {
        key: 'formKey',
      });

    mockAxios.onGet('/form/name/formKey')
      .reply(200, {
        name: 'test',
        display: 'form',
        components: [],
      });

    const wrapper = mount(<FormPage formId="id" />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    expect(wrapper.find(Form).exists()).toBe(true);
  });

  it('form does not exist handles gracefully', async () => {
    mockAxios.onGet('/camunda/engine-rest/process-definition/id/startForm')
      .reply(200, null);

    const wrapper = mount(<FormPage formId="id" />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    expect(mockAxios.history.get.length).toBe(1);
  });
});
