/*
* @noflow
*/

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {Component} from 'react';


import colors from '../../../utils/colors'

import {MagicNumbers} from '../../../utils/DeviceConfig'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

// import dismissKeysboard from 'dismissKeyboard'

const theslides = [
  {
    title: ' ',
    img: require('./assets/logo.png'),
    content: ' '
  },
  {
    title: 'BROWSE',
    img: require('./assets/tour-browse.png'),
    content: 'Find like-minded Couples and Singles.'
  },
  {
    title: 'MATCH',
    img: require('./assets/tour-match.png'),
    content: 'If they like you too, we\'ll connect you.'
  },
  {
    title: 'CONNECT',
    img: require('./assets/tour-connect.png'),
    content: 'Chat with real Couples or Singles who share your interests.'
  },
  {
    title: 'PRIVATE & DISCREET',
    img: require('./assets/tour-privacy.png'),
    content: 'Protect your identity. Easily block friends and family.'
  },

];

class Carousel extends Component {
  constructor() {
    super()
    this.state = {
      slides: theslides,
      offset: 0,
      index: 0
    }
  }
  handleScroll(e){
    let off = e.nativeEvent.contentOffset.x;
    if(off % DeviceWidth > 0) return;
    if(off < this.state.offset) {
      if(off < 0) {
        off = e.nativeEvent.contentOffset.x + (DeviceWidth * 5)
      }
    }else if(off >= DeviceWidth * this.state.slides.length){
      off = e.nativeEvent.contentOffset.x - (DeviceWidth * 5)
    }
    this.setState({
      offset: off,
      index: parseInt(off / DeviceWidth)
    })
  }
  render() {
    const {slides} = this.state
    const l = slides.length
    const welcomeSlides = [...slides, ...slides].map((slide, i) => (
      <View
        key={`${i}slide${i % l}`}
        style={[styles.slide]}
      >
        <Image
          style={{
            marginBottom: 25,
            height: MagicNumbers.is4s ? 150 : (DeviceHeight / 3) + MagicNumbers.screenPadding,
            paddingTop: 0,
            marginTop: i % l == 0 ? 100 : 0, // i % l == 0 ? MagicNumbers.screenPadding * 1.8 : MagicNumbers.screenPadding,
            width: i % l == 0 ? MagicNumbers.screenWidth + 50 : MagicNumbers.screenPadding * 4
          }}
          source={slide.img}
          defaultSource={slide.img}
          resizeMode={Image.resizeMode.contain}
        />
        <View style={[styles.textwrap, {marginBottom: 5}]} >
          <Text
            style={[styles.textplain, {
              fontFamily: 'montserrat',
              fontWeight: '800',
              marginTop: 15,
              fontSize: MagicNumbers.is4s ? 18 : 22,
            }]}
          >{slide.title}</Text>
        </View>
        {slide.content && (
          <View style={styles.textwrap}>
            <Text
              style={[styles.textplain, {
                fontSize: MagicNumbers.is5orless ? 18 : 20,
              }]}
            >{slide.content}</Text>
          </View>
        )}
      </View>
    ));

    return (
      <View collapsable>
        <ScrollView
          onScroll={this.handleScroll.bind(this)}
          style={[styles.carousel, { height: DeviceHeight - 140}]}
          horizontal
          pagingEnabled
          scrollEventThrottle={DeviceWidth * 5}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollsToTop={false}
          contentOffset={{x: this.state.offset, y: 0}}
          removeClippedSubviews
          grayDots
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'stretch',
          }}
        >
          {welcomeSlides}
        </ScrollView>

        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: MagicNumbers.screenPadding / 2 - 10,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {this.state.slides.map((s, i) => <View key={`${i}dots`} style={[styles.dot, this.state.index == i ? styles.activeDot : null]} />)}
        </View>
      </View>

    )
  }
}

Carousel.displayName = 'Carousel';

export default Carousel

const styles = StyleSheet.create({
  dot: {
    backgroundColor: colors.shuttleGray,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 4,
    borderWidth: 2,

    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    borderColor: colors.shuttleGray
  },
  activeDot: {
    backgroundColor: colors.mediumPurple,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: colors.mediumPurple
  },
  textplain: {
    color: colors.white,
    alignSelf: 'center',
    fontSize: 22,
    fontFamily: 'omnes',
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: colors.white,
    alignSelf: 'center',
    fontFamily: 'montserrat'
  },
  carousel: {
    marginTop: 0,
    width: DeviceWidth,
    // height: DeviceHeight - 190,

  },
  slide: {
    width: DeviceWidth,
    flexDirection: 'column',
    // height: DeviceHeight - 190,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: MagicNumbers.screenPadding / 2
  },


  textwrap: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },

  // dot: {
  //   backgroundColor: colors.shuttleGray,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   marginLeft: 8,
  //   marginRight: 8,
  //   marginTop: 3,
  //   marginBottom: 3,
  //   borderColor: colors.shuttleGray
  // },
  // activeDot: {
  //   backgroundColor: colors.mediumPurple20,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   marginLeft: 8,
  //   marginRight: 8,
  //   marginTop: 3,
  //   marginBottom: 3,
  //   borderWidth: 2,
  //   borderColor: colors.mediumPurple
  // }
});
