import React from 'react';
import { Image, Animated, Dimensions, Platform } from 'react-native';
import {pure} from 'recompose'
import styles from './styles';
import colors from '../../../utils/colors'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const ApproveIcon = props => (
  <Animated.View
    pointerEvents={'none'}
    key={'approveicon'}
    style={[styles.animatedIcon, {
      opacity: props.pan ? props.pan.x.interpolate({
        inputRange: [0, 50, 100, DeviceWidth / 2, DeviceWidth],
        outputRange: [0, 0, 1, 1, 1],
      }) : 0,
      backgroundColor: iOS ? 'transparent' : colors.white,
      transform: [
        {
          scale: props.pan ? props.pan.x.interpolate({
            inputRange: [0, 50, DeviceWidth / 2 + 50],
            outputRange: [0, 0, 1.2],
            extrapolate: 'clamp',
          }) : 0,
        },
        // {
        //   translateY: props.pan ? props.pan.y.interpolate({
        //     inputRange: [0, DeviceHeight],
        //     outputRange: [0, DeviceHeight],
        //   }) : 0,
        // }, {
        //   translateX: props.pan ? props.pan.x.interpolate({
        //     inputRange: [-500, -DeviceWidth / 3, DeviceWidth],
        //     outputRange: [-300, -200, 300],
        //   }) : 0,
        // },
      ],
      top: 20,
      left: 20,
    }]}
  >
    <Image
      source={require('./assets/iconApprove@3x.png')}
      style={{
        width: 100,
        height: 100,
        left: iOS ? 0 : 0,
        position: 'relative',
        paddingRight: 0,
        tintColor: iOS ? colors.white : colors.sushi
      }}
    />
  </Animated.View>
)

export default pure(ApproveIcon)
