import { StyleSheet, Text, View, TouchableHighlight, Platform, ScrollView, PixelRatio, Dimensions, Image, Settings, } from 'react-native';
import React from 'react';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import TouchID from 'react-native-touch-id'
import { connect } from 'react-redux';

import ActionMan from '../../../actions';
import Analytics from '../../../utils/Analytics';
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

@withNavigation
class SettingsSettings extends React.Component{

  static route = {
    styles: NavigationStyles.SlideHorizontal,// iOS ? SlideHorizontalIOS : FloatHorizontal,
    sceneStyle:{

    },
    statusBar: {
      translucent: false,
    },
    navigationBar: {
      visible:true,
      translucent:false,
      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
        fontWeight:'800'
      },
      tintColor: '#fff',
      backgroundColor: colors.shuttleGrayAnimate,
      title(params){
        return `SETTINGS`
      }
    }
  };

  constructor(props){
    super()
    const settings = (Settings && Settings._settings) ? Settings._settings : {LockedWithTouchID:false}
    this.state = {
      privacy: props.user.privacy || 'public',
      isLocked: (iOS && settings.LockedWithTouchID) || null
    }
  }

  componentDidMount() {
    if (iOS){
      TouchID.isSupported().then(supported => {
        __DEV__ && console.log(`TOUCH ID ${supported}`);
        this.setState({
          touchIDSupported: true
        })
      })
      .catch(error => {
        Analytics.err(error)
      });
    }
  }

  togglePrivacy(value){
    const payload = {privacy: value}
    this.props.dispatch(ActionMan.updateUser(payload))
    this.setState(payload)
  }

  openWebview(page){
    let url = '';
    let pageTitle = '';

    switch (page){
      case 'help':
        url = 'http://trippple.co/help.html';
        pageTitle = 'HELP';
        break;
      case 'privacy':
        url = 'http://trippple.co/privacy.html';
        pageTitle = 'PRIVACY POLICY';
        break;
      case 'terms':
      default:
        url = 'http://trippple.co/privacy.html';
        pageTitle = 'TERMS OF USE';
        break;
    }

    this.props.navigator.push(this.props.navigation.router.getRoute('WebViewScreen', {
      source: {uri: url},
      pageTitle
    }))


    Analytics.event('Interaction', {
      name: `${pageTitle}`,
      type: 'tap',
    })
  }

  handleTapPrivacy(){
    Analytics.event('Interaction', {
      name: 'Privacy - Private',
      type: 'tap',
    })

    if(this.state.privacy != 'private'){
      this.props.dispatch(ActionMan.showInModal({
        component: 'PrivacyPermissions',
        name: 'PrivacyPermissionsModal',
        id: 'privacymodal',
        passProps: {
          initialScreen: 'CoupleReady',
          success: () => { this.togglePrivacy('private') },
        }
      }))
    }
  }

  handleLockWithTouchID(){
    Analytics.event('Interaction', {
      name: 'Touch Id',
      type: 'tap',
      value: !this.state.isLocked
    })

    TouchID.authenticate(this.state.isLocked ? 'Disable TouchID Lock' : 'Lock Trippple')
      .then((success) => {
        const {isLocked} = this.state;

        this.setState({
          isLocked: !isLocked && success //! shouldLock
        })
        Settings.set({LockedWithTouchID: !isLocked && success})
          // Analytics.extra('Permission',{
          //   name: (shouldLock ? `Enable` : `Disable`) + 'Touch ID lock',
          //   action: 'tap',
          // })
      })
      .catch(error => {
        __DEV__ && console.log(error)
        // Alert.alert('Sorry')
      });
  }

  render(){
    const {privacy} = this.state

    return (
      <View style={{backgroundColor: colors.outerSpace, width: DeviceWidth, height: DeviceHeight, overflow: 'hidden', flex: 1, paddingTop: 0}}>

        <ScrollView
          style={{height: DeviceHeight, marginTop: 0, }}
          contentContainerStyle={{paddingHorizontal: 0, paddingBottom: 60}}
          alwaysBounceVertical



          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.paddedSpace, {marginTop: 0}]}>
            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>Privacy</Text>
            </View>
          </View>

          <TouchableHighlight
            underlayColor={colors.dark}
            style={styles.paddedSpace}
            onPress={() => { this.togglePrivacy('public') }}
          >
            <View
              style={[{
                borderBottomWidth: 1 / PixelRatio.get(),
                borderColor: colors.rollingStone,
                flexGrow: 1,
                height: 130,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row'
              }]}
            >
              <View
                style={{
                  flexWrap: 'wrap',
                  alignSelf: 'stretch',
                  flexGrow: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  width: DeviceWidth - 120,
                  flexDirection: 'column',
                  paddingRight: 20
                }}
              >
                <Text
                  style={{
                    color: privacy == 'public' ? colors.white : colors.rollingStone,
                    fontSize: 20,
                    fontFamily: 'montserrat',
                    fontWeight: '800'
                  }}
                >PUBLIC</Text>
                <Text
                  style={{
                    color: privacy == 'public' ? colors.white : colors.rollingStone,
                    fontSize: 18,
                    fontFamily: 'omnes',
                    marginTop: 5
                  }}
                >
                  Your profile is visible to all Trippple members.
                </Text>
              </View>
              <View
                style={{
                  width: 30,
                  marginHorizontal: 10
                }}
              >
                <Image
                  style={{
                    width: 40,
                    height: 40
                  }}
                  source={privacy == 'public' ? require('./assets/ovalSelected.png') : require('./assets/ovalDashed@3x.png')}
                />
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor={colors.dark}
            style={styles.paddedSpace}
            onPress={this.handleTapPrivacy.bind(this)}
          >
            <View
              style={[{
                borderBottomWidth: 1 / PixelRatio.get(),
                borderColor: colors.rollingStone,
                flexGrow: 1,
                height: 130,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row'
              }]}
            >
              <View
                style={{
                  flexWrap: 'wrap',
                  alignSelf: 'stretch',
                  flexGrow: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  width: DeviceWidth - 120,
                  flexDirection: 'column',
                  paddingRight: 20
                }}
              >
                <Text
                  style={{
                    color: privacy == 'private' ? colors.white : colors.rollingStone,
                    fontSize: 20,
                    fontFamily: 'montserrat',
                    fontWeight: '800'
                  }}
                >PRIVATE</Text>
                <Text
                  style={{
                    color: privacy == 'private' ? colors.white : colors.rollingStone,
                    fontSize: 18,
                    fontFamily: 'omnes',
                    marginTop: 5
                  }}
                >Your profile is hidden from your facebook friends and phone contacts.</Text>
              </View>
              <View
                style={{
                  width: 30,
                  marginHorizontal: 10
                }}
              >
                <Image
                  style={{
                    width: 40,
                    height: 40
                  }}
                  source={privacy == 'private' ? require('./assets/ovalSelected.png') : require('./assets/ovalDashed@3x.png')}
                />
              </View>
            </View>
          </TouchableHighlight>

          {this.state.touchIDSupported ?
            <View>
              <View style={styles.paddedSpace}>
                <View style={styles.formHeader}>
                  <Text style={styles.formHeaderText}>TouchID</Text>
                </View>
              </View>

              <TouchableHighlight
                style={styles.paddedSpace}
                onPress={this.handleLockWithTouchID.bind(this)}
                underlayColor={colors.dark}
              >
                <View
                  style={{
                    borderBottomWidth: 1 / PixelRatio.get(),
                    borderColor: colors.shuttleGray,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 18,
                      fontFamily: 'montserrat'
                    }}
                  >Lock with TouchID</Text>

                  <Image
                    style={{
                      width: 30,
                      height: 30
                    }}
                    source={this.state.isLocked ? require('./assets/ovalSelected@3x.png') :
                  require('./assets/ovalDashed@3x.png')}
                  />
                </View>
              </TouchableHighlight>
            </View>
          : null }


          <View style={styles.paddedSpace}>
            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>
                Helpful Links
              </Text>
            </View>
          </View>

          <TouchableHighlight
            style={styles.paddedSpace}
            onPress={() => { this.openWebview('privacy') }}
            underlayColor={colors.dark}
          >
            <View style={{borderBottomWidth: 1 / PixelRatio.get(), borderColor: colors.shuttleGray, height: 60, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={{color: colors.white, fontSize: 18, fontFamily: 'montserrat'}}>
                PRIVACY POLICY
              </Text>
              <Image
                style={{width: 10, height: 17.5}}
                source={require('./assets/nextArrow@3x.png')}
              />
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.paddedSpace, {marginBottom: 60}]}
            onPress={() => { this.openWebview('terms') }}
            underlayColor={colors.dark}
          >
            <View style={{borderBottomWidth: 1 / PixelRatio.get(), borderColor: colors.shuttleGray, height: 60, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={{color: colors.white, fontSize: 18, fontFamily: 'montserrat'}}>
                TERMS OF USE
              </Text>
              <Image
                style={{width: 10, height: 17.5}}
                source={require('./assets/nextArrow@3x.png')}
              />
            </View>
          </TouchableHighlight>

        </ScrollView>

      </View>
    )
  }
}
SettingsSettings.displayName = 'SettingsSettings'


const mapStateToProps = ({user, ui}, ownProps) => ({ ...ownProps, user, ui })

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(SettingsSettings);


const styles = StyleSheet.create({

  buttonText: {
    fontSize: 18,
    color: colors.white,
    alignSelf: 'center',
    fontFamily: 'montserrat'

  },
  button: {

    flexDirection: 'column',
    paddingVertical: 20,
    backgroundColor: 'transparent',
    borderColor: colors.shuttleGray,
    borderWidth: 1,

    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'relative',
    alignSelf: 'stretch',
    backgroundColor: colors.outerSpace
  //  overflow:'hidden'
  },
  inner: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.outerSpace,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },

  blur: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 40,

  },


  formHeader: {
    marginTop: 40
  },
  formHeaderText: {
    color: colors.rollingStone,
    fontFamily: 'omnes'
  },
  formRow: {
    alignItems: 'center',
    flexDirection: 'row',

    alignSelf: 'stretch',
    paddingTop: 0,
    height: 50,
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone

  },
  tallFormRow: {
    width: 250,
    left: 0,
    height: 220,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sliderFormRow: {
    height: 160,
    paddingLeft: 30,
    paddingRight: 30
  },
  picker: {
    height: 200,
    alignItems: 'stretch',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  halfcell: {
    width: DeviceWidth / 2,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around'


  },

  formLabel: {
    flex: 8,
    fontSize: 18,
    fontFamily: 'omnes'
  },
  header: {
    fontSize: 24,
    fontFamily: 'omnes'

  },
  textfield: {
    color: colors.white,
    fontSize: 20,
    alignItems: 'stretch',
    flex: 1,
    textAlign: 'left',
    fontFamily: 'montserrat',
  },
  paddedSpace: {
    paddingHorizontal: MagicNumbers.screenPadding / 2
  }

});
