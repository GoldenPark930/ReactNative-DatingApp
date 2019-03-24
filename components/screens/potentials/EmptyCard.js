import React from "react";
import {StyleSheet, Text, View, LayoutAnimation} from "react-native";

class EmptyCard extends React.Component{
  constructor(props){
    super(props)
  }
  render(){

    return (

        <View style={{
            height:70,
            bottom:0,
            position:'absolute',
            width: DeviceWidth - 80,
            backgroundColor:colors.white,
            flex:1,
            alignSelf:'stretch'
          } }/>
    )

  }
}

export default EmptyCard
