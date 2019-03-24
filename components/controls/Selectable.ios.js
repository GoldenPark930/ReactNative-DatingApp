
import React from 'react'
import {TouchableHighlight, TouchableNativeFeedback, View, Text, Image} from 'react-native'
import styles from '../screens/settings/settingsStyles';
import {MagicNumbers} from '../../utils/DeviceConfig'
import colors from '../../utils/colors';


const Selectable = ({selected, onPress, isLast, label, field, underlayColor, moreStyle = {flexGrow:-1} }) => (
  <TouchableHighlight
    underlayColor={underlayColor || colors.dark}
    onPress={() => onPress(field)}
    style={[
      isLast && { borderBottomWidth: 0 },
      moreStyle,
    ]}
  >
    <View
      style={[
      moreStyle, {
        paddingHorizontal:15
      }
     ]}
    >
      <Text
        style={{
          color: selected ? colors.white : colors.rollingStone,
          fontSize: MagicNumbers.size18,
          fontFamily: 'montserrat'
        }}
      >{label}</Text>

      {selected ? (
        <Image
          style={{
            height: 30,
            width: 30
          }}
          source={require('./assets/ovalSelected@3x.png')}
        />
      ) : (
        <View
          style={{
            height: 30,
            width: 30,
            borderWidth: 1.5,
            borderColor: colors.shuttleGray,
            borderStyle: 'dashed',
            borderRadius: 15
          }}
        />
      )}
    </View>
  </TouchableHighlight>
)

Selectable.displayName = 'Selectable'

export default Selectable
