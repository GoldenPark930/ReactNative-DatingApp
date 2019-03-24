import {
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  Dimensions,
  Platform
} from 'react-native';
import React, { Component } from 'react';


import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../../../utils/colors'
import BlurModal from '../../modals/BlurModal'
import {MagicNumbers} from '../../../utils/DeviceConfig'

import { connect } from 'react-redux';
import ActionMan from '../../../actions'

import styles from '../../modals/purpleModalStyles'
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'

const iOS = Platform.OS == 'ios';

@withNavigation
class JoinCouple extends Component{
  static route = {
    navigationBar: {
      visible: true,
      translucent: false,
      backgroundColor: colors.shuttleGrayAnimate,
      borderBottomWidth: 0,
      tintColor: '#fff',
      borderWidth: 0,
      style: {
        top: 24,
        paddingTop: 24
      },
      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
      },
      title(params){
        return 'JOIN COUPLE'
      },
      statusBar: {
        translucent: iOS,
      },
    },
  };

  componentWillReceiveProps(nProps){

    if(nProps.couple && nProps.couple.hasOwnProperty('verified') && nProps.couple.verified){

    }
  }

  nopartner(){
    this.props.navigator.push('NoPartner')

    // this.props.goNoPartner()
  }
  goEnterCouplePin(){
    this.props.navigator.push('EnterCouplePin')

  }
  goCouplePin(){

    this.props.navigator.push('CouplePin')
  }
  goBack(){
    if(this.props.user.status == 'onboarded' && this.props.user.relationship_status){
      this.props.navigator.pop()
    }else if(this.props.user.status != 'onboarded' && !this.props.user.relationship_status){
      this.props.navigator.pop()
      this.props.onboardModal({component: 'OnboardModal', passProps: {}})
    }else{
      this.props.navigator.pop()
    }
  }
  render(){
    const couple = this.props.couple;
    const imgWidth = MagicNumbers.is5orless ? 120 : 130;

    return (
      <View style={{height: DeviceHeight,flexGrow:1,
        top:0,position:'absolute',
      width: DeviceWidth,flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>


        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 150
          }}
          style={{flexGrow: 1,
            backgroundColor: colors.outerSpace
          }}
        >
          <View style={[{width: DeviceWidth, paddingTop: MagicNumbers.is5orless ? 20 : 20, paddingHorizontal: MagicNumbers.screenPadding / 2 }]} >

            <View style={{height: imgWidth, marginVertical: MagicNumbers.is5orless ? 10 : 30,
              transform: [{scale: MagicNumbers.is5orless ? 0.8 : 1 }], flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
            >
              <View
                style={{width: imgWidth, height: imgWidth, borderRadius: imgWidth / 2, marginRight: imgWidth * -1 + 20, borderColor: colors.white, borderWidth: 3, borderStyle: 'dashed'}}
              />
              <Image style={[{width: imgWidth, height: imgWidth, borderRadius: imgWidth / 2, marginLeft: imgWidth * -1 + 20}]}
                source={{uri: this.props.user.image_url}}
                defaultSource={require('../../../assets/placeholderUser.png')}
                resizeMode={Image.resizeMode.cover}
              />
          </View>

          {/* <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center',backgroundColor:'transparent', fontFamily:'montserrat',fontWeight:'800',fontSize:22,color:'#fff',marginVertical:10 }]}>
          Couple</Text> */}

          <View style={{flexDirection: 'column', marginBottom: 30 }} >
            <Text style={[styles.rowtext, styles.bigtext, {
              fontSize: MagicNumbers.is5orless ? 18 : 20,
              marginVertical: 10,
              marginHorizontal: 10,
              color: '#fff',
              marginBottom: 15,
              flexDirection: 'column',
              backgroundColor: 'transparent',
            }]}
            >
              {'Connecting with your partner is easy. Let\'s get started.'}
            </Text>
          </View>
        </View>

        <TouchableHighlight
          onPress={(f) => {
            this.goCouplePin()
          }}
          underlayColor={colors.white20}
        >
          <View style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: colors.shuttleGray,
            height: 80,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingRight: MagicNumbers.screenPadding / 1.5,
            marginLeft: MagicNumbers.screenPadding / 1.5
          }}
          >
            <View>
              <Text style={{color: colors.white, fontSize: 18, fontFamily: 'montserrat', fontWeight: '800'}}>INVITE YOUR PARTNER</Text>
              <Text style={{color: colors.rollingStone, fontSize: 16, fontFamily: 'omnes'}}>
                        Get a code and send it to them
              </Text>
            </View>
            <Image resizeMode={'contain'} style={cstyles.arrowStyle} source={{uri: 'assets/nextArrow@3x.png'}} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={(f) => {
          this.goEnterCouplePin();
        }} underlayColor={colors.white20}
        >

          <View style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: colors.shuttleGray,
            height: 80,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingRight: MagicNumbers.screenPadding / 1.5,
            marginLeft: MagicNumbers.screenPadding / 1.5
          }}
          >
            <View>
              <Text style={{color: colors.white, fontSize: 18, fontFamily: 'montserrat', fontWeight: '800'}}>ENTER COUPLE CODE</Text>
              <Text style={{color: colors.rollingStone, fontSize: 16, fontFamily: 'omnes'}}>
                        My partner gave me a code
              </Text>
            </View>
            <Image resizeMode={'contain'} style={cstyles.arrowStyle} source={{uri: 'assets/nextArrow@3x.png'}} />
          </View>
        </TouchableHighlight>
        { this.props.user.relationship_status != 'couple' && <TouchableHighlight onPress={(f) => {
          this.nopartner();
        }} underlayColor={colors.white20} style={{marginBottom: 40}}
        >

          <View style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: colors.shuttleGray,
            height: 80,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingRight: MagicNumbers.screenPadding / 1.5,
            marginLeft: MagicNumbers.screenPadding / 1.5
          }}
          >
            <View>
              <Text style={{color: colors.white, fontSize: 18, fontFamily: 'montserrat', fontWeight: '800'}}>PROCEED WITHOUT PARTNER</Text>
              <Text style={{color: colors.rollingStone, fontSize: 16, fontFamily: 'omnes'}}>
                        My partner will join later
              </Text>
            </View>
            <Image resizeMode={'contain'} style={cstyles.arrowStyle} source={{uri: 'assets/nextArrow@3x.png'}} />
          </View>
        </TouchableHighlight>
            }
        <View style={{width: 100, height: 20, left: 10, top: 0, flex: 1, position: 'absolute', alignSelf: 'flex-start', zIndex: 9999}}>
          <TouchableOpacity onPress={() => this.goBack()}>
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

const mapStateToProps = ({user, ui, app}, ownProps) => {
  return {...ownProps, user, couple: app.coupling }
}

const mapDispatchToProps = (dispatch) => {
  return { onboardModal: r => { dispatch(ActionMan.showInModal(r)) }, dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinCouple);


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
    zIndex: 9999,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
});


const cstyles = StyleSheet.create({
  arrowStyle: {
    tintColor: colors.shuttleGray,
    opacity: 0.4,
    width: 12,
    position: 'absolute',
    right: 20,
    top: 35,
    height: 12
  },
});
