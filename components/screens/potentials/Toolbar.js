import { View, ActivityIndicator, StatusBar, Dimensions, BackAndroid, Platform, NativeModules, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import MatchesButton from './MatchesButtonIcon'
import SettingsButton from './SettingsButton'
import CardStack from './CardStack';
import PotentialsPlaceholder from './PotentialsPlaceholder';
import colors from '../../../utils/colors';
import styles from './styles';
import _ from 'lodash'
import ActionMan from '../../../actions'
import {NavigationStyles, withNavigation} from '@exponent/ex-navigation'
import Router from '../../../Router'
import SliderTabBar from './SliderTabBar'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


const MatchesBrowse = () => (
  <View style={{paddingTop: 30, marginBottom:0,paddingBottom:0,width:DeviceWidth*.5,alignItems:'flex-end',flexDirection:'column',}}>
    <SliderTabBar width={DeviceWidth*.5}/>
  </View>
)

const CloseProfile = ({route}) => (
  <TouchableOpacity
    onPress={() => route.params.dispatch({type: 'CLOSE_PROFILE'})}
    style={{
      padding: 15,
      left: -5,
      width: 45,
      height: 45,
      position: 'absolute',
      top: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999
    }}
  >
    <Image
      resizeMode={Image.resizeMode.contain}
      style={{
        width: 15,
        height: 15,
        alignSelf: 'center'
      }}
      source={require('./assets/close@3x.png')}
    />
  </TouchableOpacity>
)

class Toolbar extends React.Component{
  componentWillUnmount(){

  }
  render(){
    return(

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: iOS ? 64 : 50,
          position: 'absolute',
          top: 0,
          flexGrow: 1,
          backgroundColor: colors.outerSpace,

          margin: 0,
          left:0,
          alignSelf: 'stretch',
          width: DeviceWidth,
          alignItems: 'flex-end',
          zIndex: 1900,
        }}
      >
        <SettingsButton />
        <MatchesBrowse />
        <MatchesButton />
      </View>
    )
  }
}

export default Toolbar
