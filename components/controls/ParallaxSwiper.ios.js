import React from 'react';
import {StyleSheet, Image, View, ScrollView, Platform, Animated, Dimensions} from 'react-native';
import FadeIn from '@exponent/react-native-fade-in-image';
import colors from '../../utils/colors'
import Swiper from './swiper'
import FadeSwiper from '../fadeSlider'
import XButton from '../buttons/XButton'
import {BlurView} from 'react-native-blur'
import PropTypes from 'prop-types';

const iOS = Platform.OS == 'ios';
const screen = Dimensions.get('window');
const ScrollViewPropTypes = ScrollView.propTypes;
const DeviceWidth = screen.width
const DeviceHeight = screen.height
const TOP_DISTANCE = DeviceHeight - 160;

class ParallaxSwiper extends React.Component{

  static propTypes = {
    ...ScrollViewPropTypes,
    windowHeight: PropTypes.number,
    blur: PropTypes.string,
    // contentInset: PropTypes.object,
  };

  static getDefaultProps = {
    windowHeight: 0,
    contentInset: {
      top: -20 * screen.scale
    },
    contentWidth: DeviceWidth,
    contentHeight: DeviceHeight
  };

  constructor(){
    super();
    this.state = {
      scrollY: new Animated.Value(0),
    };
    this._scrollView = {};
  }

  getScrollResponder() {
    return this._scrollView.getScrollResponder();
  }

  setNativeProps(props) {
    this._scrollView.setNativeProps(props);
  }

  maybeKillProfile(e){
    if(!this.state.wasKilled && e.value <= -100){
      this.state.scrollY.removeListener(this.maybeKillProfile.bind(this))
      this.setState({wasKilled: true})
      this.killProfile()
    }
  }

  killProfile(){
    this._scrollView.scrollTo({x: 0, y: 0, animated: false})

    this.props.killProfile && this.props.killProfile()
    this.setState({wasKilled: false})
  }

  renderBackground() {
    const { slideFrames, profileVisible, isTopCard } = this.props;
     return (
      <Animated.View
        pointerEvents={'none'}
        key={this.props.potentialkey}

        style={[styles.background, {
          // elevation: 0,
          // shadowColor: colors.darkShadow,
          // shadowOpacity: 0.4,
          // shadowRadius: 30,
          alignItems:'flex-start',
          flexDirection:'column',
          // shadowOffset: {
          //   width: 0,
          //   height: -10
          // },
          marginTop: profileVisible ? 0 : 40,
          flexGrow: 1,
          position: 'absolute',
          top: -1,
          borderRadius: 11,
          backgroundColor: iOS && isTopCard && typeof this.props.pan != 'undefined' ? this.props.pan.x.interpolate({
            inputRange: [-300, -180, -150, 0, 150, 180, 300],
            outputRange: [
              'rgba(232,74,107,1.0)',
              'rgba(232,74,107,1.0)',
              'rgba(232,74,107,1.0)',
              colors.mediumPurple70,
              'rgba(66,181,125,1.0)',
              'rgba(66,181,125,1.0)',
              'rgba(66,181,125,1.0)',
            ],
          }) : colors.mediumPurple,
        }]}
      >
        <Animated.View
          pointerEvents={'box-none'}
          style={{
            flexGrow: 1,
            borderRadius: 11,
            left: 0,
            top:0,

            overflow:'hidden',
            opacity: isTopCard && typeof this.props.pan != 'undefined' && this.props.pan.x ? this.props.pan.x.interpolate({
              inputRange: [-300, -10, 0, 10, 300],
              outputRange: [0.3, 1, 1, 1, 0.3]
            }) : 1,

          }}
        >
          {slideFrames.length > 1 ? <FadeSwiper
            slides={slideFrames.map(s => ({...s, image: s.image_url ? {uri: s.image_url } : require('../screens/potentials/assets/defaultuser.png'), imageWidth: this.props.width, imageHeight: this.props.height, }))}
            fadeDuration={350}
            stillDuration={1500}
            height={this.props.height}
          /> :
          <Image
            style={{height: this.props.height,top:0, width: this.props.width}}
            source={slideFrames[0].image_url ? {uri: slideFrames[0].image_url } : require('../screens/potentials/assets/defaultuser.png')}
            defaultSource={require('../screens/potentials/assets/defaultuser.png')}
          />
        }
         </Animated.View>

      </Animated.View>
    );
  }

  render() {
    const { style, windowHeight, profileVisible, ...props } = this.props;

    return (
      <View
        pointerEvents={'box-none'}
        style={[
          styles.container, style, {
            borderRadius: 15,
            top: 0,
          }
        ]}
      >
        {this.renderBackground()}


        {profileVisible &&
        <ScrollView
          pointerEvents={'box-none'}
          automaticallyAdjustContentInsets={false}
          ref={component => { this._scrollView = component }}
          scrollEnabled={profileVisible}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 100,
            backgroundColor: colors.dark70,
            top: TOP_DISTANCE,
          }}
          style={[styles.scrollView, {
            marginBottom: iOS ? -500 : 0,

          }]}
          vertical
          scrollEventThrottle={64}

        >
          {this.props.renderBlurView && this.props.renderBlurView()}
        {this.props.children}

          {profileVisible  ?
            <XButton
              style={{right:0}}
              onTap={() => {
                this.killProfile()
              }}
              top={0}
            /> : null
          }

        </ScrollView>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  scrollView: {
    backfaceVisibility: 'hidden'
  },
  background: {
    position: 'relative',
  },
  blur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  content: {
    // shadowColor: '#222',
    // shadowOpacity: 0.3,
    // shadowRadius: 2,
    flex: 1,
    backgroundColor:colors.outerSpace,
    flexDirection: 'column'
  }
});

export default ParallaxSwiper
