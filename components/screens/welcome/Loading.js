import React from 'react'
import {View, ActivityIndicator, Dimensions} from 'react-native'
import colors from '../../../utils/colors'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


const Loading = () => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      width: DeviceWidth,
      height: DeviceHeight,
      backgroundColor: colors.outerSpace
    }}
  >
    <ActivityIndicator
      size="large"
      color={colors.white}
      animating
      style={{}}
    />
  </View>
)

export default Loading
