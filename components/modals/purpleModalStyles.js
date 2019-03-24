import {
  Dimensions,
  StyleSheet,
  PixelRatio
} from 'react-native';
import colors from '../../utils/colors';
import { MagicNumbers } from '../../utils/DeviceConfig';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const purpleModalStyles = StyleSheet.create({
  modalButtonWrap: {
    alignSelf: 'stretch',
    borderRadius: 4,
    justifyContent: 'center',
    marginVertical: 5,
  },
  modalButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: colors.sushi,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    margin: 0,
    height: 60,
  },
  modalButtonText: {
    color: colors.white,
    fontFamily: 'montserrat',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'center',
  },
  nothankstext: {
    fontFamily: 'montserrat',
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  container: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  modalcontainer: {
    borderRadius: 4,
    backgroundColor: 'transparent',
    width: MagicNumbers.screenWidth,
  },
  fullWidth: {
    width: (MagicNumbers.screenWidth - MagicNumbers.screenPadding) / 2,
  },
  row: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 0,
    height: 70,
  },
  col: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 0,
  },
  text: {
    color: colors.white,
    fontFamily: 'omnes',
  },
  rowtext: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'omnes'
  },
  bigtext: {
    color: colors.white,
    textAlign: 'center',
  },
  separator: {
    backgroundColor: colors.outerSpace,
    height: 1,
  },
  rowtextwrapper: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  insidemodalwrapper: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    flex: 10,
    marginTop: MagicNumbers.isSmallDevice ? 0 : 20,
    width: DeviceWidth,
    height: DeviceHeight,
  },
  rowSelected: {
    backgroundColor: colors.mediumPurple20,
    borderColor: colors.mediumPurple,
    borderWidth: 1,
  },
  searchwrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.mediumPurple,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    height: 60,
  },
  searchfield: {
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 22,
    paddingHorizontal: 10,
    height: 60,
  },
  contactthumb: {
    borderRadius: 25,
    marginHorizontal: 10,
    width: 50,
    height: 50,
  },
  searchicon: {
    left: 10,
    top: 20,
    position: 'absolute',
    width: 20,
    height: 20,
  },
  cancelButton: {
    borderColor: colors.mandy,
  },
  plainButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderColor: colors.rollingStone,
    borderWidth: 1,
    justifyContent: 'center',
    height: 70,
  },
  plainButtonText: {
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily: 'montserrat',
    textAlign: 'center',
  },
  blurcontainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    width: DeviceWidth,
    height: DeviceHeight,
  },
  grayIconbuttonLeftBox: {
 // backgroundColor:colors.darkGreenBlue,
  },
  fullContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: MagicNumbers.screenPadding / 2,
    marginTop: MagicNumbers.screenPadding,
    overflow: 'hidden',
    padding: MagicNumbers.screenPadding / 2,
    width: MagicNumbers.screenWidth,
    height: (DeviceHeight - MagicNumbers.screenPadding) * 2,
  }
})

export default purpleModalStyles
