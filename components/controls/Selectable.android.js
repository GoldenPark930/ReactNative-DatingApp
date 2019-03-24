
import React from 'react'
import {TouchableNativeFeedback, View, Text, Image} from 'react-native'
import styles from '../screens/settings/settingsStyles';
import {MagicNumbers} from '../../utils/DeviceConfig'
import colors from '../../utils/colors';


const Selectable = ({selected, onPress, isLast, label, field, moreStyle = {}, diameter = 30 }) => (
  <TouchableNativeFeedback
    
    background={TouchableNativeFeedback.SelectableBackground(colors.mediumPurple || colors.dark)}
    onPress={onPress}
  >
    <View
      style={[
        styles.insideSelectable,
        styles.formRow,
        isLast && { borderBottomWidth: 0 },
        moreStyle
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
            height: diameter,
            width: diameter
          }}
          source={require('./assets/ovalSelected@3x.png')}
        />
      ) : (
        <View
          style={{
            height: diameter,
            width: diameter,
            borderWidth: 1.5,
            borderColor: colors.shuttleGray,
            borderStyle: 'dashed',
            borderRadius: diameter/2
          }}
        />
      )}
    </View>
  </TouchableNativeFeedback>
)


export default Selectable
