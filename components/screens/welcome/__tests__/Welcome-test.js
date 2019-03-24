import 'react-native';
import React from 'react';
import {Welcome} from '../welcome';

import renderer from 'react-test-renderer';


const mockFn = jest.fn();

const Analytics = new mockFn()

jest.mock('react-native-device-info');

jest.mock('Geolocation');

jest.setMock('DeviceInfo', () => require.requireMock('DeviceInfo'));

test('renders correctly', () => {
  const tree = renderer.create(
    <Welcome />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
