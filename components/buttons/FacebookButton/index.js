
import { StyleSheet, Image, Dimensions } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types'
import {MagicNumbers} from '../../../utils/DeviceConfig'

import FBSDK from 'react-native-fbsdk'
const { LoginManager, AccessToken, GraphRequest, GraphRequestManager } = FBSDK

import colors from '../../../utils/colors'
import BoxyButton from '../../controls/boxyButton'


import reactMixin from 'react-mixin'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import ActionMan from '../../../actions/';

import { connect } from 'react-redux';


class FacebookButton extends React.Component {

  static propTypes = {
    buttonText: PropTypes.string,
    buttonType: PropTypes.oneOf(['login', 'upload', 'connectionStatus', 'onboard', 'settings'])
  };

  static defaultProps = {
    buttonText: 'FACEBOOK',
    shouldLogoutOnTap: false
  };
  // propTypes: {
  //  onPress:PropTypes.func,
  //   style: StyleSheetPropType(LayoutPropTypes),
  //   permissions: PropTypes.array, // default: ["public_profile", "email"]
  //   onLogin: PropTypes.func,
  //   onLogout: PropTypes.func,
  //   onLoginFound: PropTypes.func,
  //   onLoginNotFound: PropTypes.func,
  //   onError: PropTypes.func,
  //   onCancel: PropTypes.func,
  //   onPermissionsMissing: PropTypes.func,
  // },

  constructor(props) {
    super()
    // console.log(props);
    this.state = {
      fbUser: props.fbUser
    }
  }

  onPress(e) {
    this.props.onPress && this.props.onPress(e) || this.props._onPress && this.props._onPress(e)

      // this.props.dispatch(ActionMan.facebookAuth())
  }

  render() {
    let buttonText = this.props.buttonText;
    switch (this.props.buttonType) {
      case 'uploadImage':
        buttonText = 'UPLOAD FROM FB'
        break;
      case 'connectionStatus':
        buttonText = this.state.fbUser ? 'CONNECTED' : 'CONNECT WITH FB';
        break;
      case 'onboard':
        buttonText = this.state.fbUser ? 'VERIFIED' : 'VERIFY WITH FB'
        break;
      case 'login':
        buttonText = 'LOG IN WITH FACEBOOK'
        break;
      case 'settings':
        buttonText = this.state.fbUser ? 'VERIFY NOW' : 'VERIFY NOW'
        break;
    }

    // ( this.state.fbUser ? 'CONNECTED' : 'CONNECT WITH FB')
    return (

      <BoxyButton
        text={this.props.buttonText || 'LOG IN WITH FACEBOOK'}
        buttonText={this.props.buttonTextStyle}
        outerButtonStyle={[styles.iconButtonOuter, this.props.outerButtonStyle]}
        leftBoxStyles={[styles.buttonIcon, this.props.leftBoxStyles]}
        innerWrapStyles={[styles.button, this.props.buttonStyles]}
        underlayColor={colors.cornFlower}
        elevation={10}
        _onPress={this.onPress.bind(this)}
      >

        <Image
          source={require('./fBLogo@3x.png')}
          resizeMode={Image.resizeMode.contain}
          style={{height: 30, width: 20, }}
          tintColor={this.props.iconTintColor}
        />
      </BoxyButton>

    )
  }
}
// reactMixin.onClass(FacebookButton, NativeMethodsMixin)

//
// const mapStateToProps = (state, ownProps) => {
//   console.log('state fbUser',state.fbUser,'ownProps',ownProps,state); // state
//   return { fbUser: state.fbUser }
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return { dispatch };
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(FacebookButton);
//

export default FacebookButton

const styles = StyleSheet.create({
  LogoBox: {
  },
  iconButtonOuter: {
    alignSelf: 'stretch',
    flexGrow: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    height: MagicNumbers.is5orless ? 50 : 60,
    marginVertical: 15,
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
  },

  button: {
    borderColor: colors.cornFlower,
    borderWidth: 1,
    height: MagicNumbers.is5orless ? 50 : 60,

  },
  buttonIcon: {
    width: 60,
    borderRightColor: colors.cornFlower,
    borderRightWidth: 1,
    backgroundColor: colors.cornFlower20,

  },
})
