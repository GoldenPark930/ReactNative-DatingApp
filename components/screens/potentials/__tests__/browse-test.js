import 'react-native';
import React from 'react';
import {Browse} from '../Browse';
import mockStore from 'redux-mock-store'
import Immutable from 'immutable'
import renderer from 'react-test-renderer'

test('renders correctly', () => {
  const newest =  new Immutable.OrderedMap({
    newest:{},
    swipeQueue:{},
    swipeHistory:{},
    user:{}
  })
  const data = ({
    browse: newest,
    ui:{
      browseFilter:'newest'
    },
    auth:{},
    users: [{
      user: {},
      partner: {},
      couple: {}
    }],
    newest:{},
    swipeQueue:{},
    swipeHistory:{},
    user:{},
    refreshing: false
  })
  const store = mockStore(data)();
  const tree = renderer.create(
    <Browse {...data} dispatch={store.dispatch} />
  ).toJSON();
  expect(tree).toMatchSnapshot();

});
