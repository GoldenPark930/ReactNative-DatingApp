import { LayoutAnimation } from 'react-native'

const CustomLayoutAnimations = {
  layout: {
    spring: {
      duration: 300,
      create: {
        duration: 300,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.spring,
        springDamping: .8,
      },
      update: {
        duration: 300,
        type: LayoutAnimation.Types.spring,
        springDamping: .8,
        property: LayoutAnimation.Properties.scaleXY
      }
    },
    easeInEaseOut: {
      duration: 100,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.scaleXY,
        duration: 100,

      },
      update: {

        duration: 100,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.linear,

      }
    }
  }
}

export default CustomLayoutAnimations
