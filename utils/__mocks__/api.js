
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

const {fetchNewestBrowse} = require.requireMock('../algolia')
const Api = {
  browse: jest.fn().mockImplementation(fetchNewestBrowse)
};

export default Api
