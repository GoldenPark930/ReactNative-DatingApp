import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Loading from '../Loading';


test('renders correctly', () => {
  const tree = renderer.create(
    <Loading />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
