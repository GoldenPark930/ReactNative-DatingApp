/**
* @flow
*/

import React from "react";

import {Text, StyleSheet, View, TouchableHighlight} from "react-native";

import colors from '../../utils/colors'
import TimerMixin from 'react-timer-mixin'

const TopTabs = React.createClass({
  mixins: [TimerMixin],
  getInitialState(){
    return ({
      ready: true
    })
  },
  componentDidMount(){
    this.setTimeout(
      () => {
        this.setState({
          ready: true
        })
      },
      500
    );
  },
  toggleTab(tab) {
    if(this.state.ready && this.props.active != tab){
      this.props.toggleTab(tab)
    }
  },
  render() {
    return (
      <View style={styles.topButtons}>
        <TouchableHighlight
          key={'toptablogin'}
          style={[styles.topButton,(this.props.active == 'login' ? styles.activeButton : styles.otherButton)]}
          onPress={(e)=>{
            this.toggleTab('login')
          }}
          underlayColor={this.props.active == 'login' ? colors.outerSpace : colors.rollingStone}
          >
          <Text style={[styles.buttonText, styles.activeButtonText]}>LOG IN</Text>
        </TouchableHighlight>

        <TouchableHighlight
          key={'toptabregister'}
          style={[styles.topButton,(this.props.active == 'register' ? styles.activeButton : styles.otherButton)]}
          onPress={()=>this.toggleTab('register')}
          underlayColor={this.props.active == 'register' ? colors.outerSpace : colors.rollingStone}
          >
          <Text style={[styles.buttonText, styles.activeButtonText ]}>SIGN UP</Text>
        </TouchableHighlight>
      </View>
    );
  }
});


const styles = StyleSheet.create({

  topButton: {
    height: 80,
    flex:1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  activeButton:{
    backgroundColor: colors.outerSpace,
  },
  otherButton:{
    backgroundColor: colors.shuttleGray,
  },
  buttonText: {
    fontSize: 20,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'montserrat'
  },
  inactiveButtonText:{
    color:colors.outerSpace,
},
activeButtontext:{
    color: colors.white,
},
  topButtons: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:'space-around',
    alignSelf:'stretch',
    width: undefined
  },
});

export default TopTabs
