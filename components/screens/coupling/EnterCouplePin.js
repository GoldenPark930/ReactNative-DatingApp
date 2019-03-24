import {
  StyleSheet,
  ScrollView,
  Settings,
  KeyboardAvoidingView,
  TextInput,
  Text,
  LayoutAnimation,
  TouchableOpacity,
  Image,
  Keyboard,
  Platform,
  View,
  Dimensions,
} from 'react-native';
import React from 'react';

import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import ContinueButton from '../../controls/ContinueButton';

const iOS = Platform.OS == 'ios';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../../../utils/colors'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Coupling from './index'

import { BlurView, VibrancyView } from 'react-native-blur'
import ActionMan from '../../../actions';

import { connect } from 'react-redux';
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'

class EnterCouplePin extends React.Component{
  static route = {
    styles: FloatHorizontal,
    navigationBar: {
      visible:true,
      backgroundColor: colors.shuttleGrayAnimate,
      borderBottomWidth: 0,
      tintColor: '#fff',
      borderWidth: 0,

      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
      },
      title(params){
          return `JOIN COUPLE`
      }
    },
  };

  constructor(props){
    super()
    this.state = {
      pin: '',
      submitting: false,
      absoluteContinue: true,
      verifyError: null,
      inputFieldValue: ''
    }
  }

  // backspace(){
  //   this.handleInputChange({pin: this.state.inputFieldValue.substring(0,this.state.inputFieldValue.length-1)  })
  // }

  // onChangeText(digit){
  //   if(this.state.inputFieldValue.length >= 14){ return false}
  //   this.handleInputChange({pin: this.state.inputFieldValue + digit  })
  // }
  componentDidMount(){
    const pin = this.props.pin // || Settings.get('co.trippple.deeplinkCouplePin');

    if(pin && `${pin}`.length){
      this.handleInputChange({pin: `${pin}`})
    }
    // Settings.set({'co.trippple.deeplinkCouplePin': null});
  }
  handleInputChange(event: any){
    if(this.state.submitting){ return false }

    if(!event && typeof event != 'object'){ return false }

    const pin = event.nativeEvent ? event.nativeEvent.text : event.pin;

    this.setNativeProps({text: pin})

    const newState = {
      inputFieldValue: pin
    }

    if(pin.length < this.state.inputFieldValue.length){
      newState.verifyError = false
    }
    this.setState(newState)
  }
  handleSubmit(){
    Keyboard.dismiss()
    if(this.state.submitting){ return false }
    this.setState({
      submitting: true,
    });

    if(!this.state.verifyError && !this.state.submitting && this.state.inputFieldValue.length >= 6) {
      this.setState({
        verifyError: false,
        submitting: false
      })
      this.props.dispatch(ActionMan.verifyCouplePin(this.state.inputFieldValue));
        // this.props.exit()
    }else{
      this.setState({
        verifyError: true,
        submitting: false
      })
    }
  }
  handleBackAction(){
    this.props.navigator.pop()
  }

  componentWillReceiveProps(nProps){
    if(nProps.pin){
      this.handleInputChange({pin: nProps.pin})
    }
    if(this.state.success){
      return false;
    }
    if(this.props.couple && nProps.couple && nProps.couple.hasOwnProperty('verified') && nProps.couple.verified){
      this.setState({
        success: true,
        submitting: false
      })
      // console.log(nProps.user);
      this.props.navigator.push(this.props.navigator.navigationContext.router.getRoute('CoupleReady'), {user: nProps.user});
      // this.props.exit();
    }else if(this.props.couple && nProps.couple && nProps.couple.hasOwnProperty('verified') && nProps.couple.verified == false){
      this.setState({
        verifyError: true,
       submitting: false
      })
    }
  }
  popToTop(){
    this.props.exit()
  }

  setNativeProps(np) {
    const {text} = np
    this._inp && this._inp.setNativeProps({text });
  }

  componentWillUpdate(props, state) {
    if(state.inputFieldValue.length > 0 && this.state.inputFieldValue.length == 0 || state.inputFieldValue.length == 0 && this.state.inputFieldValue.length > 0) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }
  }

  render(){
    const couple = this.props.couple;

    return (
      <View style={{flexGrow: 1,  backgroundColor: colors.outerSpace}}>
        <View style={{flexGrow: 1, top: iOS ? 0 : -20 }}
          contentContainerStyle={[{  flex: 1,  alignItems:'stretch'}]} >

          <View style={[{top: 0, marginBottom: MagicNumbers.is5orless ? 0 : 50, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',marginHorizontal: MagicNumbers.screenPadding / 2, flex: 1 }]}>
            <Text style={[styles.rowtext, styles.bigtext, { textAlign: 'center', fontFamily: 'montserrat', fontWeight: '800', fontSize: MagicNumbers.is5orless ? 17 : 20, color: '#fff', marginVertical: MagicNumbers.is5orless ? 5 : 10, backgroundColor: 'transparent' }]}>
              CONNECT WITH YOUR PARTNER
            </Text>
            <Text style={[styles.rowtext, styles.bigtext, {
                fontSize: MagicNumbers.is5orless ? 16 : 18,
                marginVertical: MagicNumbers.is5orless ? 0 : 10,
                color: '#fff',
                fontFamily: 'omnes',
                marginBottom: MagicNumbers.is5orless ? 5 : 15, textAlign: 'center', backgroundColor: 'transparent',
                flexDirection: 'column'
            }]}
            >What is your partner’s couple code?</Text>
            <View style={[styles.pinInputWrap, {marginHorizontal: MagicNumbers.screenPadding / 2, borderBottomColor: colors.mediumPurple}, (this.state.verifyError ? styles.pinInputWrapError : null), ]} >
              <TextInput
                maxLength={10}
                style={[styles.pinInput, {
                    fontSize: 26,
                    fontFamily: 'omnes',
                    color: this.state.verifyError ? colors.mandy : colors.white
                }]}
                ref={(inp) => this._inp = inp}
                editable
                keyboardAppearance={'dark'}
                keyboardType={'phone-pad'}
                autoCapitalize={'none'}
                placeholder={'ENTER CODE'}
                placeholderTextColor={'#fff'}
                autoCorrect={false}
                textAlign={'center'}
                clearButtonMode={'while-editing'}
                autoFocus
                selectionColor={colors.mediumPurple}
                onChange={this.handleInputChange.bind(this)}
              />
            </View>

            <View style={[styles.middleTextWrap, styles.underPinInput, {marginHorizontal: MagicNumbers.screenPadding / 2}]}>
              {this.state.verifyError &&
                <View style={styles.bottomErrorTextWrap}>
                  <Text style={[styles.bottomErrorText, {backgroundColor: 'transparent', textAlign: 'right'}]}>Nope. Try again</Text>
                </View>
              }
            </View>
          </View>



          <ContinueButton
            canContinue={this.state.inputFieldValue.length > 0}
            absoluteContinue
            handlePress={this.handleSubmit.bind(this)}
          />
          {/* <View style={{width: 100, height: 20, left: 10, top: 0, flex: 1, position: 'absolute', alignSelf: 'flex-start'}}>
            <TouchableOpacity onPress={this.handleBackAction.bind(this)}>
              <View style={[btnstyles.goBackButton, {left: -20, top: 15, }]}>
                <Image resizeMode={Image.resizeMode.contain} style={{margin: 0, alignItems: 'flex-start', height: 13, width: 13}} source={{uri: 'assets/close@3x.png'}} />
              </View>
            </TouchableOpacity>
          </View> */}

          </View>

        <KeyboardSpacer/>
      </View>

    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
    couple: state.app.coupling
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnterCouplePin)

const btnstyles = StyleSheet.create({
  bottomTextIcon: {
    fontSize: 14,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    color: colors.rollingStone,
    marginTop: 0
  },

  bottomText: {
    marginTop: 0,
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily: 'omnes',
  },
  goBackButton: {
    padding: 20,
    paddingLeft: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
});


const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: DeviceWidth,
    margin: 0,
    padding: 0,
    height: DeviceHeight,
    backgroundColor: colors.outerSpace,
  },
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: DeviceWidth,
    margin: 0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
    padding: 20

  },
  pinInputWrap: {
    borderBottomWidth: Platform.OS == 'android' ? 0 : 2,
    borderBottomColor: colors.rollingStone,
    height: 62,
    alignSelf: 'stretch',
    marginBottom: 0
  },
  pinInputWrapSelected: {
    borderBottomColor: colors.mediumPurple,
  },
  pinInputWrapError: {
    borderBottomColor: colors.mandy,
  },
  pinInput: {
    height: 60,
    padding: 8,
    fontSize: 30,
    fontFamily: 'montserrat',
    color: colors.white
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    height: 60,
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 20,
    fontFamily: 'omnes',
  },

  imagebg: {
    flex: 1,
    alignSelf: 'stretch',
    width: DeviceWidth,
    height: DeviceHeight,
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  underPinInput: {
    marginTop: 10,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch'
  },
  goBackButton: {
    padding: 20,
    paddingLeft: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  bottomTextIcon: {
    fontSize: 14,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    color: colors.rollingStone,
    marginTop: 0
  },

  bottomText: {
    marginTop: 0,
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily: 'omnes',
  },
  bottomErrorTextWrap: {

  },
  bottomErrorText: {
    marginTop: 0,
    color: colors.mandy,
    fontSize: 16,
    fontFamily: 'omnes',

  }
});
let animations = {
  layout: {
    spring: {
      duration: 500,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};
