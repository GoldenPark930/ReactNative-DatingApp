import React, {Component} from "react";
import {StyleSheet, TouchableHighlight, ActivityIndicator, Text, View, Image, LayoutAnimation} from "react-native";
import {Button} from '../Btn'
import colors from '../../utils/colors'
import {MagicNumbers} from '../../utils/DeviceConfig'

class BoxyButton extends Component{

  constructor(props){
    super(props)
    this.state = {
      busy:false
    }
  }

  _onPress(e){
    this.setState({busy:true})
    this.props._onPress(e)
  }

  render() {
    return (
      <TouchableHighlight
        elevation={this.props.elevation}
        onPress={this._onPress.bind(this)}
        style={[this.props.outerButtonStyle,]}
        color={this.props.underlayColor || colors.dark}
      >
        <View style={[styles.iconButton, this.props.innerWrapStyles]}>
          <View style={[styles.iconButtonLeftBox,this.props.leftBoxStyles]}>
            {this.state.busy && !this.props.stopLoading ? (
              <ActivityIndicator
                style={{top:0,height:30,width:30,marginLeft:10}}
                color={colors.white20}
                animating
                size={'small'}
              />
            ) : this.props.children}
          </View>
          <View style={styles.iconButtonRightBox}>

            <Text style={[styles.textplain, styles.iconButtonText, this.props.buttonText]}>{this.props.text}</Text>

          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default BoxyButton


const styles = StyleSheet.create({

  iconButton:{
    height:70,
    alignItems:'center',
    flexDirection: 'row',
    justifyContent:'center',
    alignSelf:'stretch',
    flex: 1,
    width: undefined
    // marginVertical:10
  },
  iconButtonLeftBox: {
    width: 80,
    height: undefined,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding:10,
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  iconButtonLeftBoxSingles: {
    backgroundColor: colors.darkSkyBlue20,
    borderRightColor: colors.darkSkyBlue,
    borderRightWidth: 1

  },
  iconButtonRightBox: {
    width: undefined,
    height: undefined,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding:20,
    flex: 1
  },
  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonSingles:{
    borderColor: colors.darkSkyBlue,
    borderWidth: 1
  },
  iconButtonSelected:{
    // backgroundColor:,
  },
  iconButtonText:{
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 14,
    fontWeight:'800',
    textAlign: 'center'
  },
});
