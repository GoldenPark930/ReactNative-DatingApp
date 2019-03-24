import { StyleSheet, LayoutAnimation, Dimensions } from 'react-native';
import React from "react";

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import colors from '../../utils/colors'
import ContinueButton from '../controls/ContinueButton'

const SingleInputScreenMixin =  {

  getInitialState() {
    return {
      inputFieldFocused: true,
      inputFieldValue: '',
      inputFieldError: null,
      canContinue: false
    };
  },
  componentWillUpdate(props, state) {
    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

    if(state.canContinue !== this.state.canContinue) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

  },

  componentDidUpdate(){

    if( !this.state.canContinue && this.shouldShow(this.state)){
      this.showContinueButton();
    }else if( this.state.canContinue && this.shouldHide(this.state)){
      this.hideContinueButton();
    }
  },

  handleInputFocused(){
    this.setState({
      inputFieldFocused: true
    })
  },

  handleInputBlurred(){
    this.setState({
      inputFieldFocused: false
    })
  },

  handleContinue(){
    if(!this.state.canContinue){
      return false;
    }

    this.setState({
      inputFieldError: null
    })
    this._submit && this._submit(this.state.inputFieldValue)
  },

  showContinueButton(){
    this.setState({
      canContinue: true
    })
  },

  hideContinueButton(){
    this.setState({
      canContinue: false
    })
  },

  renderContinueButton(){

    return(
      <ContinueButton
          canContinue={this.state.canContinue}
          absoluteContinue={this.state.absoluteContinue}
          handlePress={this.handleContinue.bind(this)}
        />
      )
  }


};
export default SingleInputScreenMixin;

const animations = {
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



const styles = StyleSheet.create({

    container: {
      alignItems:'center',
      justifyContent:'center',
      alignSelf:'stretch',
      width: DeviceWidth,
      margin:0,
      padding:0,
      height: DeviceHeight,
      backgroundColor: 'transparent',
    },
    wrap: {
      alignItems:'center',
      justifyContent:'center',
      alignSelf:'stretch',
      width: DeviceWidth,
      margin:0,
      height: DeviceHeight,
      backgroundColor: 'transparent',
      padding:20

    },
    pinInputWrap: {
      borderBottomWidth: 2,
      borderBottomColor: colors.rollingStone,
      height: 60,
      alignSelf: 'stretch'
    },
    pinInputWrapSelected:{
      borderBottomColor: colors.mediumPurple,
    },
    pinInputWrapError:{
      borderBottomColor: colors.mandy,
    },
    pinInput: {
      height: 60,
      padding: 8,
      fontSize: 30,
      fontFamily:'montserrat',
      color: colors.white
    },
    middleTextWrap: {
      alignItems:'center',
      justifyContent:'center',
      height: 60
    },
    middleText: {
      color: colors.rollingStone,
      fontSize: 21,
      fontFamily:'montserrat',
    },

    imagebg:{
      alignSelf:'stretch',
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
      backgroundColor: 'transparent',
      justifyContent: 'space-between',
      // alignItems: '',
      alignSelf: 'stretch'
    },
    goBackButton:{
      padding:10,
      paddingLeft:0,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      alignItems: 'flex-start',
      justifyContent:'center'
    },
    bottomTextIcon:{
      fontSize: 14,
      flexDirection: 'column',
      alignSelf: 'flex-end',
      color: colors.rollingStone,
      marginTop:0
    },

    bottomText: {
      marginTop: 0,
      color: colors.rollingStone,
      fontSize: 16,
      fontFamily:'omnes',
    },
    bottomErrorTextWrap:{

    },
    bottomErrorText:{
      marginTop: 0,
      color: colors.mandy,
      fontSize: 16,
      fontFamily:'omnes',

    },

    continueButtonWrap:{
      alignSelf: 'stretch',
      alignItems: 'stretch',
      justifyContent: 'center',
      height: 80,
      backgroundColor: colors.mediumPurple,

      width:DeviceWidth
    },
    continueButton: {
      height: 80,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center'
    },
    continueButtonText: {
      padding: 4,
      fontSize: 26,
      fontFamily:'montserrat',
      color: colors.white,
      textAlign:'center'
    }
  });
