import { TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { withNavigation } from '@exponent/ex-navigation';
import Router from '../../../Router'
import colors from '../../../utils/colors';

@withNavigation
export default class SettingsButton extends React.Component{
  render(){
    return (
      <TouchableOpacity
        style={{
          paddingTop: 10,
          paddingRight: 25,
          paddingLeft: 10,
          paddingBottom: 5,
        }}
        onPress={() => this.props.navigator.push(Router.getRoute('Settings'))}
      >
        <Icon
          name="menu"
          size={35}
          color={colors.white}
        />
      </TouchableOpacity>
    )
  }
}
