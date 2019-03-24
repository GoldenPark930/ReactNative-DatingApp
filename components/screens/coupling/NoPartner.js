import {
  Image,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import {withNavigation} from '@exponent/ex-navigation';

import ActionMan from '../../../actions';
import colors from '../../../utils/colors';
import styles from '../potentials/styles';
import Router from '../../../Router'

const DeviceHeight = Dimensions.get('window').height


import {MagicNumbers} from '../../../utils/DeviceConfig';
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'

const DeviceWidth = Dimensions.get('window').width

@withNavigation
class NoPartner extends React.Component{

  static route = {
    styles: FloatHorizontal,
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
      top: 24,
      paddingTop: 24,
      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
      },
      title(){
        return 'JOIN COUPLE'
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
      ...startState
    }
  }


  couple(){

    // TODO: if we are not coming from the onboard modal, we should confirm
    // with the user if they want really to join a couple. Then we need to
    // ask their partner's gender, for now it assumes hetero couple but user can manually change partner gender.
    this.props.onboardUser ?
      this.props.onboardUser() :
      this.props.dispatch(ActionMan.onboard({
        relationship_status: 'couple',
        genders: `${this.props.user.coupling ? this.props.user.coupling.genders : 'mf'}`,
        // looking_for_f: this.props.user.coupling.looking_for_f,
        // looking_for_m: this.props.user.coupling.looking_for_m,

      }));
      // this.props.dispatch(ActionMan.updateUser({

      //   looking_for_f: this.props.user.coupling.looking_for_f,
      //   looking_for_m: this.props.user.coupling.looking_for_m,
      // }))

    this.props.dispatch(ActionMan.showInModal({
      component: 'CoupleReady',
      passProps: {
        user: {
          ...this.props.user,
          partner: {
            ...this.props.user.partner,
            firstname: ''
          }
        },
        closeModal: () => {
          this.props.navigator.popToTop()
        }
      }
    }));

  }

  nothanks(){
    this.props.navigator.popToTop();
  }

  render(){
    return (
      <View
        style={{
          height: DeviceHeight, flexGrow: 1,
          top: 0,
          position: 'absolute',
          backgroundColor: colors.outerSpace,
          width: DeviceWidth,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >

        <ScrollView>
          <View style={{left: 0}}>
            <View
              style={[{
                width: DeviceWidth,
                paddingTop: MagicNumbers.is5orless ? 30 : 50,
                paddingHorizontal: MagicNumbers.screenPadding / 2
              }]}
            >
              <View
                style={{
                  height: 120,
                  marginVertical: MagicNumbers.is5orless ? 10 : 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{scale: MagicNumbers.is5orless ? 0.8 : 1 }]
                }}
              >
                <View
                  style={[{backgroundColor: colors.white20, width: 120, height: 120, borderRadius: 60, marginRight: -100}]}
                />
                <Image
                  style={[{width: 120, height: 120, borderRadius: 60, marginLeft: -100}]}
                  source={{uri: this.props.user.image_url}}
                  defaultSource={require('../../../assets/placeholderUser.png')}
                  resizeMode={Image.resizeMode.cover}

                />
              </View>

              <Text
                style={[styles.rowtext, styles.bigtext, {
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  fontFamily: 'montserrat',
                  fontWeight: '800',
                  fontSize: 22,
                  color: '#fff',
                  marginVertical: 10
                }]}
              >COUPLE</Text>

              <View style={{flexDirection: 'column' }} >
                <Text style={[styles.rowtext, styles.bigtext, {
                  fontSize: MagicNumbers.is5orless ? 17 : 20,
                  marginVertical: 10,
                  color: '#fff',
                  marginBottom: 15,
                  fontFamily: 'omnes',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  flexDirection: 'column'
                }]}
                >You can proceed as a couple even if your partner isn’t ready to join Trippple. However, we strongly encourage you to invite your partner since couples with confirmed partners get 64% more matches.</Text>
              </View>

              <View style={{alignItems: 'center', justifyContent: 'center'}}>

                {this.state.submitting ?
                  <ActivityIndicator
                    style={[{width: 80, height: 80}]}
                    size="large"
                    animating
                  /> : (
                    <TouchableHighlight
                      underlayColor={colors.white20}
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: colors.white,
                        borderWidth: 1,
                        borderRadius: 5,
                        marginHorizontal: 0,
                        marginTop: 20,
                        marginBottom: 15
                      }}
                      onPress={this.couple.bind(this)}
                    >
                      <View
                        style={{paddingVertical: 20, paddingHorizontal: MagicNumbers.is5orless ? 10 : 20}}
                      >
                        <Text
                        style={{
                          fontFamily: 'montserrat',
                          fontWeight: '800',
                          backgroundColor: 'transparent',
                          fontSize: MagicNumbers.is5orless ? 16 : 18,
                          textAlign: 'center',
                          color: '#fff',
                        }}
                      >PROCEED AS A COUPLE</Text>
                      </View>
                    </TouchableHighlight>
                )}
              </View>
              <TouchableOpacity onPress={this.nothanks.bind(this)}>
                <Text
                  style={{
                    backgroundColor: 'transparent',
                    fontSize: 16,
                    textAlign: 'center',
                    fontFamily: 'omnes',
                    marginVertical: MagicNumbers.is5orless ? 5 : 40,
                    color: colors.rollingStone,
                  }}
                >Nevermind</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View
            style={{
              width: 100,
              height: 20,
              left: 10,
              top: 0,
              flex: 1,
              position: 'absolute',
              alignSelf: 'flex-start',
              zIndex: 9999
            }}
          >
            <TouchableOpacity onPress={() => this.props.navigator.pop()}>
              <View style={btnstyles.goBackButton}>
                <Text
                  textAlign={'left'}
                  style={[btnstyles.bottomTextIcon]}
                >◀︎ </Text>
                <Text
                  textAlign={'left'}
                  style={[btnstyles.bottomText]}
                >Go back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
 }


const mapStateToProps = (state, ownProps) => {
  return { ...ownProps, pin: state.app.couplePin, user: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoPartner);


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
