/*
* @flow
*/
import React from "react";

import {Component} from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";

import colors from '../../utils/colors'


class BackButton extends Component{
  constructor(props){
    super(props);
    this.state = {}

  }


  goBack(){
    this.props.navigator.pop();

  }

  render(){
      return (
          <TouchableOpacity
              onPress={this.goBack.bind(this)}>
              <View style={styles.goBackButton}>
                <Text textAlign={'left'} style={[styles.bottomTextIcon]}>◀︎ </Text>
                <Text textAlign={'left'} style={[styles.bottomText]}>Go back</Text>
              </View>
            </TouchableOpacity>
        )

  }
}


export default BackButton;


const styles = StyleSheet.create({
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
  goBackButton:{
    padding:20,
    paddingLeft:0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent:'center'
  },
});
