
import { StyleSheet } from 'react-native'

import colors from './utils/colors'

import Dimensions from 'Dimensions';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const SharedStyles = StyleSheet.create({
   continueButtonWrap:{
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: 80,
    backgroundColor: colors.mediumPurple,
    width:DeviceWidth
  },
  continueButton: {
    height: 80,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  continueButtonText: {
    padding: 4,
    fontSize: 26,
    fontFamily:'montserrat',
    color: colors.white,
    textAlign:'center'
  }
});

export default SharedStyles
