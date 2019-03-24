
import React from "react";
import {Component} from "react";
import {StyleSheet, Text, View, TouchableOpacity, Image} from "react-native";

const styles = StyleSheet.create({
  navBarLeftButton:{
    position:'absolute',
    top:50,
    width:50,
    height:50,
    backgroundColor:'transparent',
    left:10
  }
})

class CloseButton extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <View style={[styles.navBarLeftButton]}>
        <TouchableOpacity onPress={() => this.props.navigator.jumpForward() }>
          <Image
            resizeMode={Image.resizeMode.contain}
            style={{width:20,height:20,marginTop:15,alignItems:'flex-start'}}
            source={{uri: 'assets/close@3x.png'}}
          />
        </TouchableOpacity>
     </View>

    )
  }
}



export default CloseButton
