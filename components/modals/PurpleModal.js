

import { View, ScrollView, Dimensions, Platform } from 'react-native';
import React, { Component } from 'react';


import { BlurView } from 'react-native-blur'
import styles from './purpleModalStyles'
import {MagicNumbers} from '../../utils/DeviceConfig'
import colors from '../../utils/colors'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const iOS = Platform.OS == 'ios';



class PurpleModal extends Component{

  constructor(props) {
    super();
    this.state = {}
  }
  cancel(){
    this.props.goBack && this.props.goBack();
    this.props.navigator && this.props.navigator.pop()
  }
  render(){
    return (
      <View
        style={[{
          padding: 0,
          backgroundColor: 'transparent',
          flex: 1,
          position: 'absolute',
          height: DeviceHeight,
          width: DeviceWidth,
          justifyContent: 'center',
          top: 0,
          alignItems: 'center',
        }]}
      >
        {iOS ? (
          <BlurView
            blurType="dark"
            style={{
              position: 'absolute',
              height: DeviceHeight,
              width: DeviceWidth,
              top: 0,
            }}
          />
        ) : (
          <View
            style={{
              position: 'absolute',
              height: DeviceHeight,
              width: DeviceWidth,
              top: 0,
            }}
          />
          )
        }


        <ScrollView
          contentContainerStyle={[styles.modalcontainer, {
            height: DeviceHeight,
            justifyContent: 'center',
            alignItems: 'stretch',
          }]}
          style={[{ flex: 1, padding:0,}]}
        >
          {this.props.children}
        </ScrollView>

      </View>

    )
  }
}

export default PurpleModal
