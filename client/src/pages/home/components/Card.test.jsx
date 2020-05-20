import React from 'react';
import { shallow } from 'enzyme';
import Card from './Card';

describe('Card', () => {
  it('renders without crashing', () => {
    shallow(<Card isLoading={false} handleClick={() => {}} footer="test" href="href" count={0} />);
  });

  it('can handle onclick', () => {
    const mockHandle = jest.fn();
    const wrapper = shallow(<Card isLoading={false} handleClick={mockHandle} footer="test" href="href" count={0} />);
    wrapper.find('a').at(0).simulate('click', {
      preventDefault: () => {
      },
    });
    expect(mockHandle).toBeCalled();
  });
});
