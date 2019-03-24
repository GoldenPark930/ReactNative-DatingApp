import 'react-native';
import React from 'react';
import Carousel from '../carousel';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(
    <Carousel />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
