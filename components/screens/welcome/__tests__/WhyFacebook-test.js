import 'react-native';
import React from 'react';

import renderer from 'react-test-renderer';

import WhyFacebook from '../WhyFacebook';

test('renders correctly', () => {
  const tree = renderer.create(
    <WhyFacebook />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
