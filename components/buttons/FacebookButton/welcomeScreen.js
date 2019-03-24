import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import colors from '../../../utils/colors'
import Btn from '../../Btn'

class FacebookButton extends React.Component {

  static defaultProps = {
    buttonText: 'FACEBOOK',
    shouldLogoutOnTap: false
  };

  constructor(props) {
    super()
    this.state = {
      fbUser: props.fbUser
    }
  }

  onPress(e) {
    this.props.onPress ? this.props.onPress(e) : (this.props._onPress && this.props._onPress(e))

      // this.props.dispatch(ActionMan.facebookAuth())
  }

  render() {
    return (
      <Btn
        color={colors.white}
        elevation={10}
        inStyle={[styles.iconButtonOuter]}
        onPress={this.onPress.bind(this)}
        disabled={this.props.busy}
      >
        <Icon name="sc-facebook" size={40} color="#fff" style={styles.icon}/>
        <Text style={styles.btntext}>{this.props.buttonText || 'LOG IN WITH FACEBOOK'}</Text>
      </Btn>

    )
  }
}
export default FacebookButton

const styles = StyleSheet.create({
  icon: {
    marginRight: 5
  },
  LogoBox: {
  },
  btntext: {
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 17,
    fontWeight: '800'
  },
  iconButtonOuter: {
    backgroundColor: colors.cornFlower,
    alignSelf: 'stretch',
    flexGrow: 0,
    height: 70,
    margin: 0,
    paddingHorizontal: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },

  button: {
    borderColor: colors.cornFlower,
    borderWidth: 1,
    height: MagicNumbers.is5orless ? 50 : 50,

  },
  buttonIcon: {
    width: 40,
    borderRightColor: colors.cornFlower,
    borderRightWidth: 1,
    backgroundColor: colors.cornFlower20,

  },
})
