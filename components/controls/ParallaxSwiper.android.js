import React from 'react';
import {StyleSheet, Image, View, ScrollView, Platform, Animated, Dimensions} from 'react-native';
import colors from '../../utils/colors'
import Swiper from './swiper'
import XButton from '../buttons/XButton'
import FadeSwiper from '../fadeSlider'
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
      imgLoaded: new Animated.Value(0),
    };
    this._scrollView = {};
  }

  componentDidMount(){
    // this.state.scrollY.addListener(this.maybeKillProfile.bind(this))
      //
      // setTimeout(()=>{
      //     console.log(this._scrollView)
      //     const snode = this._scrollView
      //
      //     console.log('SNODE',snode);
      //     // this.setState({
      //     //   snode
      //     // })
      //
      //   },3000)

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
  imgLoad(){
    setImmediate(() => {
      Animated.timing(this.state.imgLoaded, {
        duration: 300,
        toValue: 100,
      }).start(() => {

      })
    })
  }

  renderBackground() {
    const { slideFrames, profileVisible, isTopCard } = this.props;
    // const { scrollY } = this.state;
    // if (!windowHeight || !swiper) {
    //   return null;
    // }
    const slides = slideFrames.map((p, i) => {
      let {image_url} = p;


      return (

        <Image
          source={{uri: image_url }}
          defaultSource={require('../screens/potentials/assets/defaultuser.png')}
          loadingIndicatorSrc={null}
          key={`${p.id}slide${i}`}
          onLoad={this.imgLoad.bind(this)}
          style={{
            height: this.props.height,
            width: DeviceWidth,
            overlayColor: 'transparent',
            borderRadius: 11,
            alignSelf:'flex-end',
            bottom: this.props.profileVisible ? 0 : 0,
            // top:100
          }}
        />
      )
    });

    return (
      <Animated.View
        pointerEvents={'none'}

        style={[styles.background, {
          // elevation: 0,
          shadowColor: colors.darkShadow,
          shadowOpacity: 0.4,
          shadowRadius: 30,
          alignItems:'flex-end',
          flexDirection:'column',
          shadowOffset: {
            width: 0,
            height: -10
          },
          marginTop:profileVisible ? 0 : 0,
          flex: 1,
          position: 'absolute',
          top: profileVisible ? 0 : 0,
          borderRadius: 9,
          backgroundColor: colors.mediumPurple20,
        }]}
      >
        <View
          onLayout={this.props.doOnLayout}
          pointerEvents={'box-none'}
          style={{
            flex: 1,
            borderRadius: 11,
            left: 0,

          }}
        >
          {slideFrames.length > 1 ? <FadeSwiper
            slides={slideFrames.map(s => ({...s, image: s.image_url ? {uri: s.image_url } : require('../screens/potentials/assets/defaultuser.png'), imageWidth: this.props.width, imageHeight: this.props.height, }))}
            fadeDuration={350}
            stillDuration={1500}
            height={this.props.height}
          /> :
          <Image
            style={{height: this.props.height, width: this.props.width,borderRadius: 11,}}
            source={slideFrames[0].image_url ? {uri: slideFrames[0].image_url } : require('../screens/potentials/assets/defaultuser.png')}
          />
        }
        </View>

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
            borderRadius: 11,
            top: 0,

          }
        ]}
      >
        {this.renderBackground()}

        {/*

          onMoveShouldSetResponder={(e) => {console.log('onMoveShouldSetResponder',e.nativeEvent.pageY); return e.nativeEvent.pageY > 300}}
          onStartShouldSetResponderCapture={(e) => {console.log('onStartShouldSetResponderCapture',e); return false}}
          onStartShouldSetResponder={(e) => {console.log('onStartShouldSetResponder',e); return false}}
          onResponderReject={(e) => {console.log('onResponderReject',e)}}
          onResponderTerminationRequest={e=>{console.log('onResponderTerminationRequest',e.nativeEvent)}}


  */}
        {profileVisible &&
        <ScrollView
          pointerEvents={'box-none'}

          automaticallyAdjustContentInsets={false}
          ref={component => { this._scrollView = component }}
          scrollEnabled={profileVisible}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}

          contentContainerStyle={{
            flexGrow: 1,
            height: DeviceHeight + TOP_DISTANCE,
            backgroundColor: colors.dark70,
            height: DeviceHeight+1000,

            top: TOP_DISTANCE,
          }}
          style={[
            styles.scrollView, {
              marginBottom: iOS ? -500 : 0,
              height: DeviceHeight,

            }
          ]}
          vertical
          scrollEventThrottle={64}
        >

          <View
            style={{
              top: 0,
              zIndex: 0,
              flexGrow: 1,

              borderBottomLeftRadius: 11,
              borderBottomRightRadius: 11,
              backgroundColor: colors.outerSpace70,
              paddingTop: 0
            }}
            pointerEvents={'box-none'}

          >
            {this.props.children}
          </View>
          {profileVisible &&
            <XButton
              style={{right:0}}
              onTap={() => {
                this.killProfile()
              }}
              top={0}
            />
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
    shadowColor: '#222',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    flex: 1,
    flexDirection: 'column'
  }
});

export default ParallaxSwiper
