import React from 'react'
import { View, Dimensions } from "react-native";
import colors from '../../utils/colors'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const dotWidth = 6;
const dots = [1,2,3];


const Dots = ({dotColor}) => (
  <View style={{
    width:50,
    height:43,
    justifyContent:'center',
    alignItems:'center',
  }}>
    <View style={{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
    }}>
      { dots.map((dot,i) =>
        <View
          style={{
            marginHorizontal:2,
            width:dotWidth,
            height:dotWidth,
            borderRadius:dotWidth/2,
            backgroundColor:dotColor || colors.shuttleGray
          }}
          key={'threedotsnumber'+i}
        />
      )}
    </View>
  </View>
);

export default Dots
