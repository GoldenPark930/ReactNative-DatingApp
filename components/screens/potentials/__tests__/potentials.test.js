import 'react-native';
import React from 'react';
import Potentials from '../potentials';
import mockStore from 'redux-mock-store'

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const store = mockStore({ui:{potentialsPage:1},auth:{}})()
  const tree = renderer.create(
    <Potentials store={store} profileVisible={false} potentialsPage={1} />
  ).toJSON();
  expect(tree).toMatchSnapshot();

});
