import React from 'react';
import moment from 'moment';

import BoxyButton from '../../controls/boxyButton';
import Contacts from '../contacts';
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import {
  NavigationStyles, withNavigation
} from '@exponent/ex-navigation';
import ActionMan from '../../../actions'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  TextInput,Platform,
  ScrollView,
  Animated,
  Alert,
  Image,
  NativeModules,
  AsyncStorage,
  Navigator
} from 'react-native'
import { connect } from 'react-redux';
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'

import ProfileField from '../../controls/ProfileField'
const currentyear = new Date().getFullYear();
const MIN_DATE = new Date().setFullYear(currentyear - 18)
const MAX_DATE = new Date().setFullYear(currentyear - 60)

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const iOS = Platform.OS == 'ios';


@withNavigation
class SettingsCouple extends React.Component{


  static route = {
    styles: iOS ? SlideHorizontalIOS : FloatHorizontal,
    sceneStyle: {

    },
    statusBar: {
      translucent: false,
    },
    navigationBar: {
      visible: true,
      translucent: false,
      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
        fontWeight: '800'
      },
      tintColor: '#fff',
      backgroundColor: colors.shuttleGrayAnimate,
      title(params){
        return 'COUPLE'
      }
    }
  };

  constructor(props){
    super(props)
  }

  invitePartner(){

//         this.props.navigator.push({
//           component: Contacts,
//           passProps:{
//             _continue: ()=>{
//               // console.log(this.props.navigator)
//               let routes = this.props.navigator.getCurrentRoutes()
//               let thisRoute = routes[routes.length-3]
//               this.props.navigator.popToRoute(thisRoute);
//               this.props.dispatch(ActionMan.getUserInfo())
//             }
//           }

        // })

  }

  decouple(){
    const p = this.props.user.partner || {};
    if(p.firstname){
      Alert.alert(
                `Leave ${p.firstname}?`,
                'Are you sure you want to leave this couple?',
        [
                  {text: 'Yes', onPress: () => {
                    this.props.dispatch(ActionMan.decouple())
                    this.props.navigator.pop()
                  }},
                  {text: 'No', onPress: () => { return false }},
        ]
      )
    }else{
      this.props.dispatch(ActionMan.decouple())
      this.props.navigator.pop()
    }
  }

  render(){
    const u = this.props.user;
    const settingOptions = this.props.settingOptions || {};

    let {partner, user} = this.props;
    if(!partner) partner = {};
    return (

      <View
        style={{
          backgroundColor: colors.outerSpace,
          width: DeviceWidth,
          height: DeviceHeight,
          overflow: 'hidden',
          flex: 1,
          paddingTop: 0
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}




        >

          { (partner.id) &&
          <View>
            <View style={{height: 120,top:20,backgroundColor: colors.dark, width: 120, borderRadius:60,alignItems: 'center', alignSelf: 'center'}}>
              <Image
                style={styles.userimage}
                key={partner.thumb_url}
                source={partner.thumb_url ? {uri: partner.thumb_url } : require('../chat/assets/placeholderUserWhite.png')}
                defaultSource={require('../chat/assets/placeholderUserWhite.png')}
                resizeMode={Image.resizeMode.cover}
              />

            </View>
            <View style={{ paddingHorizontal: MagicNumbers.screenPadding / 2, }}>
              <View style={styles.formHeader}>
                <Text style={styles.formHeaderText}>Your Partner</Text>
              </View>
            </View>

            {['firstname'].map((field, i) => (
              <ProfileField
                navigation={this.props.navigation}
                key={`${field}key${i * 10}`}
                user={partner}
                dispatch={this.props.dispatch}
                navigator={this.props.navigator}
                fieldName={field}
                forPartner
                field_type={'input'}

                field={settingOptions[field]}
              />
                      ))}

            {['birthday'].map((field, i) => {
              return (
                <ProfileField
                  dispatch={this.props.dispatch}
                  key={`${field}keybd${i * 1000}`}
                  user={partner.birthday ? partner : this.props.user}
                  forPartner
                  navigator={this.props.navigator}
                  navigation={this.props.navigation}
                  fieldName={'birthday'}
                  fieldValue={new Date(this.props.user.partner.birthday || MIN_DATE)}
                  field_type={'date'}
                  dispatch={this.props.dispatch}
                  field={settingOptions[field]}
                  label={'birthday'}
                />
                        )
            })}
            {['gender'].map((field, i) => {
              return (

                <ProfileField
                  dispatch={this.props.dispatch}
                  forPartner
                  key={`${field}key${i * 1000}`}
                  user={partner}
                  navigator={this.props.navigator}
                  navigation={this.props.navigation}
                  fieldName={field}
                  field={settingOptions[field]}
                  fieldValue={this.props.user.partner.gender}

                />
                        )
            })}


          </View>
                }

            { this.props.user.partner && this.props.user.partner.id && this.props.user.partner.is_fake_partner ? (
              <TouchableOpacity
                style={{
                  alignSelf: 'stretch',
                  marginTop:30,
                  borderRadius: 5,
                  flexDirection: 'row',
                  marginHorizontal: MagicNumbers.screenPadding / 2,
                  backgroundColor: 'transparent',
                  borderColor: colors.sushi,
                  borderWidth: 2
                }}
                underlayColor={colors.darkShadow}
                onPress={(f) => {
                  this.props.dispatch(ActionMan.pushRoute('JoinCouple',{}));
                }}
              >
                <View style={{padding: 20, flex: 1}}>
                  <Text style={{
                    backgroundColor: 'transparent',
                    color: colors.sushi,
                    fontSize: 18,
                    textAlign: 'center',
                    fontFamily: 'montserrat'
                  }}
                  >JOIN YOUR REAL PARTNER</Text>
                </View>
              </TouchableOpacity>
            ) : null
           }


          <TouchableOpacity
            style={{
              alignSelf: 'stretch',
              marginBottom:50,
              borderRadius: 5,
              flexDirection: 'row',
              marginTop:20,
              marginHorizontal: MagicNumbers.screenPadding / 2,
              backgroundColor: 'transparent',
              borderColor: colors.mandy,
              borderWidth: 2
            }}
            underlayColor={colors.darkShadow}
            onPress={this.decouple.bind(this)}
          >
            <View style={{padding: 20, flex: 1}}>
              <Text style={{
                backgroundColor: 'transparent',
                color: colors.mandy,
                fontSize: 18,
                textAlign: 'center',
                fontFamily: 'montserrat'
              }}
              >LEAVE COUPLE</Text>
            </View>
          </TouchableOpacity>
          {/*! partner.phone &&
                    <View>
                    <View style={{height:120,width:120,alignItems:'center',alignSelf:'center',marginBottom:20}}>
                      <Image
                        style={[styles.userimage]}
                        key={partner.thumb_url}
                        source={{uri: 'assets/iconModalDenied@3x'}}
                        resizeMode={Image.resizeMode.contain}/>

                      </View>
                      <View style={styles.middleTextWrap}>
                        <Text style={styles.middleText}>Oh no! You don't have a partner! Go ahead and invite someone now</Text>
                      </View>
                      <BoxyButton
                        text={"INVITE YOUR PARTNER"}
                        leftBoxStyles={styles.iconButtonLeftBoxCouples}
                        innerWrapStyles={styles.iconButtonCouples}
                        outerButtonStyle={{
                          alignSelf:'stretch',
                          flexDirection:'row',
                          marginHorizontal:MagicNumbers.screenPadding/2
                        }}
                        underlayColor={colors.mediumPurple20}
                        _onPress={this.invitePartner.bind(this)}>

                        <Image source={{uri: 'assets/ovalInvite@3x.png'}}
                                  resizeMode={Image.resizeMode.contain}
                                      style={{height:30,width:101}} />

                    </BoxyButton>
                    </View>
                    */}

        </ScrollView>
      </View>


    )
  }
}

SettingsCouple.displayName = 'SettingsCouple'

const mapStateToProps = (state, ownProps) => {
  return {...ownProps, user: state.user, partner: state.user.partner }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsCouple);

const styles = StyleSheet.create({
  iconButtonCouples: {
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
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
  closebox: {
    height: 40,
    width: 40,
    backgroundColor: 'blue'
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
  userimage: {
    width: 120, height: 120, borderRadius: 60, alignSelf: 'center',
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginHorizontal: 20,
    marginBottom: 20
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 18,

    textAlign: 'center',
  },
  middleTextSmall: {
    fontSize: 17
  },
});
