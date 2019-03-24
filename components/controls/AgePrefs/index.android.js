import React from 'react'
import reactMixin from 'react-mixin'
import { StyleSheet, Text, View, TouchableHighlight, Animated, TouchableOpacity, PanResponder, Easing, Dimensions } from 'react-native'
import TimerMixin from 'react-timer-mixin'
import ActionMan from '../../../actions'
import { MagicNumbers } from '../../../utils/DeviceConfig'
import colors from '../../../utils/colors'
import MultiSlider from './multislidertryout'


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const InsideWidth = MagicNumbers.isSmallDevice ? DeviceWidth - MagicNumbers.screenPadding : DeviceWidth - 62
const SliderWidth = MagicNumbers.isSmallDevice ? DeviceWidth - 40 : DeviceWidth - 62
const MIN_AGE = 18
const MAX_AGE = 50
const MIN_AGE_GROUP_DISTANCE = 4 // /years

class AgePrefs extends React.Component{
  constructor(props){
    super(props)
    this._timeout = null;

    const possibleRange = MAX_AGE - MIN_AGE
    const numberGroups = parseInt(possibleRange / MIN_AGE_GROUP_DISTANCE)
    const dots = [];

    for (let i = 0; i <= numberGroups; i++) {
      dots.push({index: i, start_age: MIN_AGE + (MIN_AGE_GROUP_DISTANCE * i)})
    }


    this.state = {
      dots,
      numberGroups,
      match_age_min: Math.max(props.user.match_age_min, MIN_AGE),
      match_age_max: Math.min(props.user.match_age_max, MAX_AGE) || MAX_AGE
    }
  }

  componentDidUpdate(prevProps, prevState){
    // const {match_age_min,match_age_max} = this.state
    // if(prevState.match_age_min == match_age_min && prevState.match_age_max == match_age_max) return false
    //
    // if(this._timeout) this.clearTimeout(this._timeout)

  }

  updateAttributes(){
    const {match_age_min, match_age_max} = this.state;
    this.props.dispatch(ActionMan.updateUser({match_age_min, match_age_max}));// todo fix
  }

  render(){
    const {match_age_max, match_age_min} = this.state

    const {dots} = this.state
    const dotWidth = SliderWidth / this.state.numberGroups

    return (
      <View>
      <View
        style={{
          flexDirection: 'column', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', height: 50, width: MagicNumbers.screenWidth, backgroundColor: 'transparent'
        }}
      >

        <View
          style={{
            paddingHorizontal: 0, flexDirection: 'row', width: MagicNumbers.screenWidth, justifyContent: 'space-between'
          }}
        >
          <Text
            style={[{
              alignSelf: 'flex-start', color: colors.rollingStone, textAlign: 'left', fontFamily: 'omnes'
            }]}
          >{'Age Range'}</Text>

          <Text
            style={{
              alignSelf: 'flex-end', color: colors.white, textAlign: 'right', fontFamily: 'omnes', marginRight: 0, marginBottom: 10
            }}
          >{`${this.state.match_age_min} - ${this.state.match_age_max == 50 ? '50+' : this.state.match_age_max}`}</Text>
        </View>
</View>
<View
  style={{
    flexDirection: 'column', alignSelf: 'center', alignItems: 'center', justifyContent: 'flex-start', height: 70, width: DeviceWidth, backgroundColor: 'transparent'
  }}
>

        <View
          style={{
            left: MagicNumbers.isSmallDevice ? 2 : 0,
            paddingHorizontal: 0,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center'
          }}
        >
        <MultiSlider
        values={[this.state.match_age_min,this.state.match_age_max]}
        sliderLength={MagicNumbers.screenWidth-20}
        min={MIN_AGE}
        max={MAX_AGE}
        onValuesChange={(v) => {
          this.setState({
            match_age_min: v[0],
            match_age_max: v[1]
          })
        }}
        onValuesChangeFinish={() => {
          this.updateAttributes()
        }}
      />
        </View>
  </View>
      </View>
    )
  }
}


class ActiveDot extends React.Component{

  constructor(props){
    super();
    this.state = {
      ageValue: null,
      ageVal: new Animated.Value(0),
    }
  }

  componentWillMount(){
    this.state.ageVal.setValue(SliderWidth * (this.props.ageVal - 18) / 32)
    this.initializePanResponder();
  }

  componentWillReceiveProps(nProps){
    const nval = Math.round(SliderWidth * (nProps.ageVal - 18) / 32);
    // if(Math.abs(this._animatedValueX - nval) >= SliderWidth/this.props.numberGroups){
    this._animatedValueX = nval;

    Animated.spring(this.state.ageVal, {
      toValue: nval,
      tension: 40,
      useNativeDriver: true,
      friction: 10
    }).start()
    // }
  }

  shouldComponentUpdate(nProps, nState){
    const nval = SliderWidth * (nProps.ageVal - 18) / 32;
    if (nProps.ageVal == this.props.ageVal){
      return false
    }
    return true
  }

  componentWillUnmount() {
    this.state.ageVal.removeAllListeners();
  }

  initializePanResponder(){
    this._animatedValueX = SliderWidth * (this.props.ageVal - 18) / 32

    this.state.ageVal.addListener((value) => {
      this._animatedValueX = value.value;
    })

    this._panResponder = PanResponder.create({
      onStartShouldSetResponderCapture: () => { this.props.toggleScroll('off'); return false },
      onStartShouldSetPanResponderCapture: () => { this.props.toggleScroll('off'); return false },
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onMoveShouldSetResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.state.ageVal.stopAnimation();
        // this.state.ageVal.setOffset(this._animatedValueX);
        // this.state.ageVal.setValue(0);
      },
      onPanResponderMove: Animated.event([null, {dx: this.state.ageVal, useNativeDriver: true }]),
      // onPanResponderRelease: (e, gestureState) => {
      //   if (this._animatedValueX > SliderWidth){
      //     this._animatedValueX = SliderWidth
      //   } else if (this._animatedValueX < 0){
      //     this._animatedValueX = 0
      //   } else {
      //       // this._animatedValueX = gestureState.dx
      //   }
      //   this.state.ageVal.flattenOffset(); // Flatten the offset so it resets the default positioning
      //   let newAgeVal = Math.round((this._animatedValueX * 32) / SliderWidth) + 18
      //
      //   if (newAgeVal % 4 != 2){
      //     if (newAgeVal % 4 == 0){
      //       newAgeVal = gestureState.vx > 0 ? newAgeVal + 2 : newAgeVal - 2
      //     } else {
      //       newAgeVal = gestureState.vx > 0 ? newAgeVal + newAgeVal % 4 : newAgeVal - 4 + newAgeVal % 4
      //     }
      //   }
      //   this.props.updateVal(newAgeVal)
      //
      //     // var toValue = Math.round(SliderWidth * (dot[gestureState.gx > 0 ? 0 : dot.length-1].start_age-18) / 32)
      //     //
      //     // Animated.spring(this.state.ageVal,{
      //     //   toValue,
      //     //   tension:40,
      //     //   friction: 10,
      //     // }).start((fin)=>{
      //     //   // if(fin.finished) {
      //   this.props.toggleScroll('on');
      //     //   // }
          // })
      // },
      onPanResponderTerminate: (e, gestureState) => {
        if (this._animatedValueX > SliderWidth){
          this._animatedValueX = SliderWidth
        } else if (this._animatedValueX < 0){
          this._animatedValueX = 0
        } else {
            // this._animatedValueX = gestureState.dx
        }
        this.state.ageVal.flattenOffset(); // Flatten the offset so it resets the default positioning
        let newAgeVal = Math.round((this._animatedValueX * 32) / SliderWidth) + 18
        if (newAgeVal % 4 != 2){
          newAgeVal = gestureState.vx > 0 ? newAgeVal + newAgeVal % 4 : newAgeVal - 4 + newAgeVal % 4
        }
        this.props.updateVal(newAgeVal)

          // var dot = this.props.dots.filter((gestureState.vx > 0 ? ((n) => n.start_age >= newAgeVal ) : (n) => n.start_age <= newAgeVal) );
          //
          // var toValue = Math.round(SliderWidth * (dot[gestureState.gx > 0 ? 0 : dot.length-1].start_age-18) / 32)

          // Animated.spring(this.state.ageVal,{
          //   toValue,
          //   tension:60,
          //   friction: 7,
          // }).start((fin)=>{
          //   // if(fin.finished) {
          //     this.props.toggleScroll('on');
          //   // }
          // })
      }

    })
  }
  render(){
    const {ageVal} = this.state
    const dotWidthInterpolatedWidth = Math.round(SliderWidth / this.props.numberGroups)

// Some arbitrary interpolations for making the handle drag nicelyer

    const inputRange = this.props.dots.reduce((arr, dot, i) => {
      arr.push(dotWidthInterpolatedWidth * i)
      // arr.push(dotWidthInterpolatedWidth*(i) + 1)
      // arr.push(dotWidthInterpolatedWidth*(i) +5)
      // arr.push(dotWidthInterpolatedWidth*(i+1) - 30 )
      // arr.push(dotWidthInterpolatedWidth*(i+1) )
      // arr.push(dotWidthInterpolatedWidth+dotWidthInterpolatedWidth*i)
      // arr.push(dotWidthInterpolatedWidth+MIN_AGE_GROUP_DISTANCE)
      return arr
    }, [0])
    const outputRange = this.props.dots.reduce((arr, dot, i) => {
      arr.push(dotWidthInterpolatedWidth * i)
      // arr.push(dotWidthInterpolatedWidth*(i) + 1 )
      // arr.push(dotWidthInterpolatedWidth*(i)+ 20)
      // arr.push(dotWidthInterpolatedWidth*(i +1) - 10)
      // arr.push(dotWidthInterpolatedWidth*(i+1) )
      return arr
    }, [0])
    return (
      <Animated.Image {...this._panResponder.panHandlers}
        style={{
          transform: [{translateX: ageVal}],
          backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center',
          height: 42, width: 36, position: 'absolute', bottom: 10,
          left: MagicNumbers.isSmallDevice ? -10 : -12,
        }} source={require('./assets/sliderHandle@3x.png')}
      >
        <Text style={{backgroundColor: 'transparent', textAlign: 'center', color: colors.white, fontSize: 12}}>{
            this.props.ageVal == 50 ? '50+' : this.props.ageVal
          }</Text>
      </Animated.Image>

    )
  }
}

reactMixin(AgePrefs.prototype, TimerMixin)


export default AgePrefs


const styles = StyleSheet.create({


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'relative',
    alignSelf: 'stretch',
    backgroundColor: 'transparent'
  //  overflow:'hidden'
  },
  inner: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
})
