'use strict';

import {
  View,
  ActivityIndicator,
  Dimensions,
  AppState,
  NativeModules,
  TouchableNativeFeedback,
  Image
} from 'react-native';
import React from "react";
import colors from '../../../utils/colors';
import styles from './styles';
import { connect } from 'react-redux';
import { withNavigation } from '@exponent/ex-navigation';
import Btn from '../../Btn';
import Router from '../../../Router'

@withNavigation
class MatchesButton extends React.Component{
  render(){
    return (
      <TouchableNativeFeedback
        hitSlop={{top: 10, bottom: 10, right: 10, left: 50}}

        style={{ width: 42, height: 42, borderRadius:21,}}
        onPress={()=>{
           this.props.navigator.push('Matches')
        }}
        background={TouchableNativeFeedback.SelectableBackground()}
      >
      <View
      style={{ paddingVertical:5, paddingHorizontal:7,width: 42, height: 42, borderRadius:21, marginRight:10}}
      >

        <Image
          tintColor={colors.white}
          resizeMode={Image.resizeMode.contain}
          style={{width: 28, top: 0, height: 30, tintColor: colors.white}}
          source={require('./assets/chat@3x.png')}
        />
        {this.props.unread.total && parseInt(this.props.unread.total) > 0 || this.props.unread.realTotal &&   parseInt(this.props.unread.realTotal) > 0 ?
          <View style={{borderWidth:2,borderColor:colors.outerSpace,width:10,height:10,borderRadius:10,backgroundColor:colors.mediumPurple, position:'absolute',top:5,right:3}} /> : null}
        </View>


      </TouchableNativeFeedback>
    )
  }
}


const mapStateToProps = ({notifications, unread}, ownProps) => {

  return { ...ownProps, notifications, unread }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchesButton);
