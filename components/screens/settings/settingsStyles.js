
import { StyleSheet, Dimensions, PixelRatio } from 'react-native'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'



const styles = StyleSheet.create({
 container: {
   justifyContent: 'center',
   alignItems: 'stretch',
   position:'relative',
   alignSelf: 'stretch',
   backgroundColor:colors.outerSpace
  //  overflow:'hidden'
 },
 inner:{
   alignItems: 'stretch',
  //  height:DeviceHeight,
   backgroundColor:colors.outerSpace,
   flexDirection:'column',
   justifyContent:'flex-start'
 },

 blur:{
   flex:1,
   alignSelf:'stretch',
   alignItems:'center',
   paddingTop: 0,
   paddingBottom: 40,

 },


 formHeader:{
   marginTop:40
 },
 formHeaderText:{
   color: colors.rollingStone,
   fontFamily: 'omnes'
 },
 formRow: {
   alignItems: 'center',
   flexDirection: 'row',
   alignSelf: 'stretch',
   paddingTop:0,
   flex:1,
   borderBottomWidth:StyleSheet.hairlineWidth,
   borderBottomColor: colors.rollingStone

 },
 tallFormRow: {
   width: 250,
   left:0,
   height:220,
   alignSelf:'stretch',
   alignItems: 'center',
   flexDirection: 'row',
   justifyContent: 'center'
},
insideSelectable:{
  height:60,
  alignItems:'center',
  justifyContent:'space-between',
  flexDirection:'row'
},
bioText:{
  color:colors.white,
  height:50,
  fontSize:18,
  overflow:'hidden',
  alignSelf:'stretch',
  flexWrap:'wrap',
  textAlign:'left',
  fontFamily: 'omnes'

},
 sliderFormRow:{
   height:160,
   paddingLeft: 30,
   paddingRight:30
 },
 picker:{
   height:200,
   alignItems: 'stretch',
   flexDirection: 'column',
   alignSelf:'flex-end',
   justifyContent:'center',
 },
 halfcell:{
   width:DeviceWidth / 2,
   alignItems: 'center',
   alignSelf:'center',
   justifyContent:'space-around'


 },

 formLabel: {
   flex: 8,
   fontSize: 18,
   fontFamily:'omnes'
 },
 header:{
   fontSize:24,
   fontFamily:'omnes'

 },
 textfield:{
   color: colors.white,
   fontSize:20,
   alignItems: 'stretch',
   flex:1,
   textAlign: 'left',
   fontFamily:'montserrat',
 },
 paddedSpace:{
   paddingHorizontal:MagicNumbers.screenPadding/2
 },

 autogrowTextinput:{
     alignSelf: 'stretch',
     padding: 0,
     fontSize: MagicNumbers.size18 + 2,
     fontFamily:'omnes',
     color: colors.white,
     width:DeviceWidth - MagicNumbers.screenPadding
 },
 textareaWrap:{
   marginHorizontal:MagicNumbers.screenPadding/2,
   height:70,
   width:DeviceWidth - MagicNumbers.screenPadding,
   flexWrap:'wrap',
   alignItems:'center',
   justifyContent:'center',
   flexDirection:'column',
   borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor:colors.shuttleGray
  }

});

export default styles
