import { View, TouchableNativeFeedback, Image } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'

import colors from '../../../utils/colors';
import ActionMan from '../../../actions'


const SettingsButton = ({openDrawer}) => (
  <TouchableNativeFeedback
    hitSlop={{top: 10, bottom: 10, left: 10, right: 50}}
    style={{ width: 42, height: 42, borderRadius: 21, }}
    onPress={openDrawer}
    background={TouchableNativeFeedback.SelectableBackground()}
  >
    <View
      style={{
        paddingVertical: 5,
        paddingHorizontal: 5,
        width: 42,
        height: 42,
        borderRadius: 21,
        marginLeft: 10
      }}
    >
    <Icon
      name="menu"
      size={35}
      color={colors.white}
    />
  </View>
  </TouchableNativeFeedback>
)

const mapDispatchToProps = (dispatch) => ({
  openDrawer: () => {
    dispatch(ActionMan.getUserInfo())
    dispatch({type: 'OPEN_DRAWER'})
  }
})


export default connect(null, mapDispatchToProps)(SettingsButton)
