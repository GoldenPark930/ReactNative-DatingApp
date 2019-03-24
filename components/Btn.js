import React from 'react'
import { Platform, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native'

const androidTouchable = ({color, round, onPress, children, inStyle = {}, style = {}}) => (
  <TouchableNativeFeedback
    background={TouchableNativeFeedback.Ripple(color)}
    onPress={onPress}
    useForeground
    style={{borderRadius: round ? 15 : 0}}
  >
    <View style={[inStyle, style]}>
      {children}
    </View>
  </TouchableNativeFeedback>
)

const iosTouchable = ({color, onPress, children, inStyle = {}, style = {}}) => (
  <TouchableHighlight
    underlayColor={(color)}
    onPress={onPress}
  >
    <View style={[inStyle, style]}>
      {children}
    </View>
  </TouchableHighlight>
)


module.exports = Platform.select({
  ios: iosTouchable,
  android: androidTouchable
})
