import {  View, Dimensions } from 'react-native';


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import { cardStackReducer } from 'react-native-navigation-redux-helpers';

const fakeScene = props => {
	  return (<View style={{zIndex:9999,backgroundColor:'transparent',width:DeviceWidth,height:DeviceHeight,position:'absolute'}}/>)
};

const initialState = {
  key: 'global',
  index: 0,
  routes: [
    {
      component: fakeScene,
      index: 0,
      key:'fakeScene'
    },
  ],
};

module.exports = cardStackReducer(initialState);
