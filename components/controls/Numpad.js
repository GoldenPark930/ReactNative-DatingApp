'use strict';


import React from "react";
import { Text,TextInput,View,StyleSheet,TouchableHighlight,Dimensions,PixelRatio,Image  } from 'react-native'
import colors from '../../utils/colors'
import {MagicNumbers} from '../../utils/DeviceConfig'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const digits =  [1, 2, 3, 4, 5, 6, 7, 8, 9]
const KEYBOARD_HEIGHT = MagicNumbers.keyboardHeight

// 2 cool
// const digits =  ( (i) =>  {return Array.from(new Array(9), () => i++)}(1))

class Numpad extends React.Component{

  constructor(props: Object){
    super()
  }

  render(){

    return (
        <View
          style={[styles.numberPadWrap,this.props.numpadstyles]}

          >
          <View style={styles.keyWrapper}>
            { digits.map( (el,i)=>
              <TouchableHighlight
                key={'phonepad'+i}
                underlayColor={colors.outerSpace}
                onPress={()=>this.props.onChangeText(i+1)}
                >
                <View style={[
                    styles.gridKeys,
                    { borderTopWidth: i >= 3 ? 1/PixelRatio.get() : 0,
                    borderRightWidth: (i+1)%3 == 2 ? 1/PixelRatio.get() : 0,
                    borderLeftWidth: (i+1)%3 == 2 ? 1/PixelRatio.get() : 0, }
                  ]}>
                  <Text style={styles.whiteText}>
                    {i+1}
                  </Text>
                </View>
              </TouchableHighlight>
            ) }

            <TouchableHighlight
              key={'phonepadnull'}
              underlayColor={colors.outerSpace}
              >
              <View style={styles.bottomRowKeys}>
                <Text style={styles.whiteText}>
                  {' '}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              key={'phonepad0'}
              underlayColor={colors.outerSpace}
              onPress={()=>this.props.onChangeText('0')}
              >
              <View style={[styles.bottomRowKeys,{
                borderColor:colors.outerSpace,
                backgroundColor:colors.dark,
                borderRightWidth:1/PixelRatio.get(),
                borderLeftWidth: 1/PixelRatio.get()
              }]}>
                <Text style={styles.whiteText}>
                  {'0'}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              key={'phonepaddel'}
              underlayColor={colors.outerSpace}
              style={{alignSelf:'flex-end'}}
              onPress={()=>this.props.backspace()}
              >
              <View style={[styles.bottomRowKeys]}>
                <Image style={{width:33,height:20}} source={{uri:'assets/btn-delete@3x.png'}} resizeMode={Image.resizeMode.contain}/>
              </View>
            </TouchableHighlight>

          </View>
        </View>
    )
  }
}
export default Numpad

const styles = StyleSheet.create({
  numberPadWrap: {
    height: KEYBOARD_HEIGHT,
    paddingVertical:0,
    width:DeviceWidth,
    alignSelf:'flex-end',
    position:'absolute',
    bottom:0,
    left:0,
    backgroundColor:colors.dark
  },
  keyWrapper:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'center',
    alignItems:'center'
  },
  gridKeys: {
    width:DeviceWidth/3,
height:KEYBOARD_HEIGHT/4,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'stretch',
    borderColor:colors.outerSpace,
    backgroundColor:colors.dark
  },

  bottomRowKeys: {
    width:DeviceWidth/3,
    height:KEYBOARD_HEIGHT/4,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'stretch',
    borderTopWidth:1/PixelRatio.get(),
    borderTopColor:colors.outerSpace,
    backgroundColor:'#313D44'

  },
  whiteText:{
    fontSize:30,
    textAlign:'center',
    color:colors.white
  },
  backButton:{
    fontSize:16,
    textAlign:'center',
    color:colors.white
  }

})
