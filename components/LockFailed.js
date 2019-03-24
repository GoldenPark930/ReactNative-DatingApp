import React, {Component} from "react";
import {View, Text, TouchableHighlight, Dimensions} from "react-native";
import colors from '../utils/colors'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

class LockFailed extends Component{

  render(){
    return (

      <View style={{padding:20,height:DeviceHeight,width:DeviceWidth,flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:colors.white,fontSize:20,textAlign:'center'}}>Please authenticate with TouchID to access Trippple.</Text>
        <TouchableHighlight
          underlayColor={colors.mediumPurple}
          onPress={this.props.retry}
          style={{padding:20,backgroundColor:colors.sushi,width:DeviceWidth-50,borderRadius:8,marginTop:50}}
        >
          <Text style={{color:colors.white,fontSize:24,textAlign:'center'}}>Retry</Text>
        </TouchableHighlight>

      </View>
    )
  }
}

export default LockFailed
