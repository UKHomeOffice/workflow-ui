import React from 'react';
import { shallow } from 'enzyme';
import Card from './Card';

describe('Card', () => {
  it('renders without crashing', () => {
    shallow(<Card isLoading={false} handleClick={() => {}} footer="test" href="href" count={0} />);
  });
});
