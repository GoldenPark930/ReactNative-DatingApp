import React from "react";
import {StyleSheet, Dimensions, PixelRatio} from "react-native";
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../../utils/colors'
import {MagicNumbers} from '../../utils/DeviceConfig'

const styles = StyleSheet.create({
  modalButton:{
    alignSelf:'stretch',
    backgroundColor:colors.sushi,
    borderColor:colors.darkGreenBlue,
    alignItems:'center',
    margin: 6,
    borderRadius:4,
    justifyContent:'center',
    flex:1,
    flexDirection:'column',
    borderWidth:1/PixelRatio.get()
},
modalButtonText:{
  color:colors.white,
  fontFamily:'montserrat',
  fontSize:20,

textAlign:'center'
},
  container: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.outerSpace,
    alignSelf:'stretch',
    flexDirection: 'column',

  },
  modalcontainer:{
    backgroundColor: colors.white,
    flex:1,
    width: MagicNumbers.screenWidth,
    borderRadius:10,
    padding:MagicNumbers.screenPadding/2,
    margin:MagicNumbers.screenPadding/2
  },
  fullwidth:{
    width: DeviceWidth
  },
  row: {
    flexDirection: 'row',
    padding: 0,
    alignSelf:'stretch',
    height:70,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems:'center',
    justifyContent:'flex-start'
  },
  col: {
    flexDirection: 'column',
    padding: 0,
    alignSelf:'stretch',
    flex: 1,
    backgroundColor: 'transparent',
    alignItems:'center',
    justifyContent:'center'
  },
  text:{
    color: colors.shuttleGray,
    fontFamily:'omnes'
  },
  rowtext:{
    color: colors.white,
    fontSize:18,
    fontFamily:'omnes'
  },
  bigtext: {
    textAlign:'center',
    color: colors.white,

  },
  separator: {
    height: 1,
    backgroundColor: colors.outerSpace,
  },
  rowtextwrapper:{
    flexDirection:'column',
    justifyContent:'space-around'
},
insidemodalwrapper:{
    flexDirection:'column',
    justifyContent:'space-around',
    alignItems:'center',
    flex:1,
    marginTop:50,
    alignSelf:'stretch',
},
  rowSelected:{
    backgroundColor: colors.mediumPurple20,
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  searchwrap:{
    flexDirection: 'row',
    // justifyContent: 'space-between',
    height:60,

    alignSelf:'stretch',
    alignItems:'center',
    borderBottomWidth: 2,
    marginHorizontal:10,
    borderBottomColor: colors.mediumPurple
  },
  searchfield:{
    color:colors.white,
    fontSize:22,
    alignItems: 'stretch',
    flex:1,
    paddingHorizontal:10,
    fontFamily:'montserrat',
    height:60,
    backgroundColor: 'transparent',

  },
  bottomTextIcon:{
     fontSize: 14,
     flexDirection: 'column',
     alignSelf: 'flex-end',
     color: colors.rollingStone,
     marginTop:0
   },
  goBackButton:{
    padding:20,
    paddingLeft:0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent:'center'
  },
  wrapper:{
    backgroundColor: colors.outerSpace,

  },
  contactthumb:{
    borderRadius: 25,
    width:50,
    height:50,
    marginHorizontal:10
  },
  searchicon:{
    // marginRight:20,
    // position:'absolute',
    width:20,
    height:20
  },
  plainButton:{
    borderColor: colors.rollingStone,
    borderWidth: 1,
    height:70,
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent:'center',
  },
  plainButtonText:{
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily:'montserrat',
    textAlign:'center',
  },
})
export default styles
