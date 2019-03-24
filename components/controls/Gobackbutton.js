import React from "react";
import {Component} from "react";
import {Text, StyleSheet, View, TouchableOpacity} from "react-native";

import colors from '../../utils/colors'
import Dimensions from 'Dimensions';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class Gobackbutton extends Component{
  constructor(props){
    super()
  }
  _goBack(){
    this.props.navigator.pop()
  }
  render(){
    return (
      <TouchableOpacity onPress={this._goBack.bind(this)} style={styles.leftbutton}>
        <View>
          <Text style={{color:colors.shuttleGray}}>Go Back</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  leftbutton:{
    width:80,
    alignSelf: 'flex-start',
    height:50,
    paddingVertical:10
  },

})
export default Gobackbutton
