import {
  Image,
  Text,
  Share,
  ScrollView,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import ActionMan from '../../../actions';
import colors from '../../../utils/colors';
import styles from '../potentials/styles';
import {MagicNumbers} from '../../../utils/DeviceConfig';
import { connect } from 'react-redux';
import {SHOW_COUPLING} from '../../../utils/SettingsConstants'

import {NavigationStyles, withNavigation} from '@exponent/ex-navigation';
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

@withNavigation
class CouplePin extends React.Component{

  static route = {
    styles: FloatHorizontal,
    navigationBar: {
      visible: true,
      backgroundColor: colors.shuttleGrayAnimate,
      borderBottomWidth: 0,
      tintColor: '#fff',
      borderWidth: 0,
      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
      },
      title(params){
        return 'COUPLE'
      }
    },
    sceneStyle: {
      backgroundColor: colors.outerSpace,
    },

  };

  constructor(props){
    super()
    const startState = props.startState || {}

    this.state = {
      success: false,
      bounceValue: new Animated.Value(0),
      ...startState
    }
  }

  componentWillReceiveProps(nProps){
    if(!this.state.success) return false;
    if(nProps.couple && ((nProps.couple.hasOwnProperty('verified') && nProps.couple.verified) || (nProps.couple.hasOwnProperty('sentInvite') && nProps.couple.sentInvite))){
      this.setState({
        success: true,
      })
      this.onboardUser()
    }
    if(!this.props.sentInvite && nProps.sentInvite){
      this.onboardUser()

    }
  }
  onboardUser(){

    const lookingfor = this.props.selected_theirs ? Object.keys(this.props.selected_theirs).reduce((acc, s) => {
      acc[`looking_for_${s}`] = this.props.selected_theirs[s];
      return acc;
    }, {}) : {
      loooking_for_m: true,
      looking_for_f: true
    };

    const payload = {
      relationship_status: 'couple',
      genders: this.props.selected_genders || this.props.user.coupling ? this.props.user.coupling.genders : 'mf',
      ...lookingfor
    };

    this.props.dispatch({type: 'TOGGLE_SENT_INVITE', payload: {}})
    this.props.dispatch(ActionMan.onboard(payload))
    // this.props.navigator.pop()

  }
  handleSendMessage(){
    const pin = this.props.pin;
    const messageText = `Join me on Trippple! My couple code is ${pin}.`;
    this.props.dispatch(ActionMan.share({ pin, messageText }))

    this.setState({ submitting: true });

  }

  componentDidMount(){
    this.props.dispatch(ActionMan.getCouplePin());

    // Settings.set({[SHOW_COUPLING]:false})
    if(this.state.success){
      this.animateSuccess()
    }
  }

  animateSuccess(){
    Animated.sequence([
      Animated.delay(700),
      Animated.spring(
        this.state.bounceValue,
        {
          toValue: 1.0,
          tension: 0,
          velocity: 3,  // Velocity makes it move
          friction: 1,
        }
      )
    ]).start(() => {
      // this.setState({ success:false });
    })
  }

  componentDidUpdate(pProps, pState){
    if(!pState.success && this.state.success){
      this.animateSuccess()
    }
  }

  popToTop(){
    this.props.navigator.popToTop()
  }

  renderSuccess(){
    return (
      <View style={{flexGrow: 1, backgroundColor: colors.outerSpace}}>
        <Animated.View
          style={{
            width: DeviceWidth,
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            marginTop: 80,
            transform: [{scale: this.state.bounceValue ? this.state.bounceValue : 1}, ],
          }}
        >
          <Image
            source={{uri: 'assets/checkMark@3x.png'}}
            style={{width: 150, height: 150, tintColor: colors.mediumPurple }}
            resizeMode={Image.resizeMode.contain}
          />
        </Animated.View>

        <View style={{flex: 1, height: DeviceHeight * 0.65, paddingHorizontal: MagicNumbers.screenPadding / 2, alignItems: 'center', justifyContent: 'center', width: DeviceWidth, flexDirection: 'column'}}>

          <Text
            style={[styles.rowtext, styles.bigtext, {
              backgroundColor: 'transparent',
              fontSize: 24,
              color: '#ffffff',
              marginTop: 0,
              textAlign: 'center',
              fontFamily: 'montserrat',
              fontWeight: '800',
            }]}
          >COUPLE CREATED</Text>

          <Text
            style={[styles.rowtext, styles.bigtext, {
              fontSize: 17,
              backgroundColor: 'transparent',
              marginVertical: 10,
              color: '#fff',
              marginBottom: 15,
              textAlign: 'center',
              flexDirection: 'column'
            }]}
          >When your partner joins Trippple, they can use your couple code to conenct with you.</Text>

          <Text
            style={[styles.rowtext, styles.bigtext, {
              fontSize: 17,
              backgroundColor: 'transparent',
              marginVertical: 10,
              color: '#fff',
              marginBottom: 15,
              textAlign: 'center',
              flexDirection: 'column'
            }]}
          >You can access your couple code at any time in your Trippple settings screen.</Text>

          <TouchableHighlight
            underlayColor={colors.white20}
            style={{backgroundColor: 'transparent', borderColor: colors.white, borderWidth: 1, borderRadius: 5, marginHorizontal: 10, marginTop: 30, marginBottom: 15}}
            onPress={this.popToTop.bind(this)}
          >
            <View style={{paddingVertical: 20, paddingHorizontal: 40}} >
              <Text style={{fontFamily: 'montserrat', fontWeight: '800', backgroundColor: 'transparent', fontSize: 18, textAlign: 'center', color: '#fff', }}>
              THAN</Text>
            </View>
          </TouchableHighlight>

        </View>
      </View>
    )
  }

  renderMain(){

    const couple = this.props.couple || {};

    return (
      <View style={{left: 0}}>
        <View style={[{width: DeviceWidth, paddingTop: MagicNumbers.is5orless ? 30 : 50, paddingHorizontal: MagicNumbers.screenPadding / 2 }]} >

          {/* <View style={{height: 120, marginVertical: MagicNumbers.is5orless ? 10 : 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', transform: [{scale: MagicNumbers.is5orless ? 0.8 : 1 }]}}>
            <View
              style={{width: 116, height: 116, borderRadius: 60, marginRight: -100, borderColor: colors.white, borderWidth: 3, borderStyle: 'dashed'}}
            />
            <Image style={[{width: 120, height: 120, borderRadius: 60, marginLeft: -100}]}
              source={{uri: this.props.user.image_url}}
              defaultSource={require('../chat/assets/placeholderUser@3x.png')}
            />
          </View> */}

          <Text style={[styles.rowtext, styles.bigtext, { textAlign: 'center', backgroundColor: 'transparent', fontFamily: 'montserrat', fontWeight: '800', fontSize: 22, color: '#fff', marginVertical: 10 }]}>
            YOUR COUPLE CODE
          </Text>

          <View style={{flexDirection: 'column' }} >
            <Text
              style={[styles.rowtext, styles.bigtext, {
                fontSize: MagicNumbers.is5orless ? 17 : 20,
                marginVertical: 10,
                color: '#fff',
                marginBottom: 15,
                backgroundColor: 'transparent',
                flexDirection: 'column'
              }]}
            >
            Share this number with your partner to help them connect with you on trippple.
            </Text>
          </View>

          <Text
            style={[styles.rowtext, styles.bigtext, {
              fontSize: 50,
              marginVertical: MagicNumbers.is5orless ? 10 : 30,
              color: '#fff',
              backgroundColor: 'transparent',
              textAlign: 'center',
              fontFamily: 'montserrat',
              fontWeight: '800',
            }]}
          >
            {this.props.pin}
          </Text>

          <View style={{alignItems: 'center', justifyContent: 'center'}}>

            <TouchableHighlight
              underlayColor={colors.white20}
              style={{backgroundColor: 'transparent', borderColor: colors.white, borderWidth: 1, borderRadius: 5, marginHorizontal: 0, marginTop: 20, marginBottom: 15}}
              onPress={this.handleSendMessage.bind(this)}
            >
              <View style={{paddingVertical: 20, paddingHorizontal: MagicNumbers.is5orless ? 10 : 20}} >
                <Text style={{fontFamily: 'montserrat', fontWeight: '800', backgroundColor: 'transparent', fontSize: MagicNumbers.is5orless ? 16 : 18, textAlign: 'center', color: '#fff', }}>
                TEXT CODE TO MY PARTNER
                </Text>
              </View>
            </TouchableHighlight>

          </View>
          <TouchableOpacity onPress={() => { this.props.navigator.pop() }}>
            <Text style={{backgroundColor: 'transparent', fontSize: 16, textAlign: 'center', marginVertical: MagicNumbers.is5orless ? 5 : 40, color: colors.rollingStone, }}>
            Nevermind.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  render(){
    return (
      <View
        style={{height: DeviceHeight,
          flexGrow: 1,
          top: 0,
          position: 'absolute',
          width: DeviceWidth,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'}}
      >

        <ScrollView
          showsVerticalScrollIndicator={false}
          vertical
        >
          { this.state.success ? this.renderSuccess() : this.renderMain() }
          <View style={{width: 100, height: 20, left: 10, top: 0, flex: 1, position: 'absolute', alignSelf: 'flex-start', zIndex: 9999}}>
            <TouchableOpacity onPress={() => this.props.navigator.pop()}>
              <View style={btnstyles.goBackButton}>
                <Text textAlign={'left'} style={[btnstyles.bottomTextIcon]}>◀︎ </Text>
                <Text textAlign={'left'} style={[btnstyles.bottomText]}>Go back</Text>
              </View>
            </TouchableOpacity>
          </View>


        </ScrollView>
      </View>

    )
  }
}

const btnstyles = StyleSheet.create({
  bottomTextIcon: {
    fontSize: 14,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    color: colors.rollingStone,
    marginTop: 0
  },

  bottomText: {
    marginTop: 0,
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily: 'omnes',
  },
  goBackButton: {
    padding: 20,
    paddingLeft: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
});
const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  pin: state.app.couplePin,
  user: state.user,
  couple: state.app.coupling,
  sentInvite: state.app.sentInvite
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(CouplePin);
