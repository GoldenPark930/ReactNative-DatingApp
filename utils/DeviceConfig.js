import {Dimensions, PixelRatio} from 'react-native'


const screen = Dimensions.get('window')

const keyboardHeightMapShort =  {
  480: 216, //4S
  568: 217, //5
  667: 215, //6
  736: 226, //6 Plus
}
// 568: 224, //5
// 667: 225, //6
// 736: 236,
const keyboardHeightMap =  {
  480: 224, //4S
  568: 253, //5
  667: 258, //6
  736: 271, //6 Plus
}

const keyboardHeight = keyboardHeightMapShort[screen.height];
const MagicNumbers = {
    keyboardHeight,
    is5orless: screen.height <= 568,
    is4s: screen.height <= 480,
    isSmallDevice: screen.width < 360,
    screenWidth: screen.width > 360 ? (screen.width - 50) : (screen.width - 25),
    screenPadding: screen.width > 360 ? 50 : 25,
    size18: screen.width > 360 ? 18 : 16,
    continueButtonHeight: screen.scale == 2 && screen.height <= 480 ? 60 : 80


}
export {MagicNumbers}
