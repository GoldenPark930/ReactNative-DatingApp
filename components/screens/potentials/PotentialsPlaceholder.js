import { Text, View, Image, Dimensions, ActivityIndicator, LayoutAnimation, TouchableOpacity, NativeModules, Platform } from 'react-native';
import React from 'react';
import {pure,onlyUpdateForKeys} from 'recompose'
import {connect} from 'react-redux'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import FadeInContainer from '../../FadeInContainer';
import colors from '../../../utils/colors';
import styles from './styles';
import config from '../../../../config'
import profileOptions from '../../../data/get_client_user_profile_options'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import ActionMan from '../../../actions'
import Router from '../../../Router'
import Btn from '../../Btn'
const iOS = Platform.OS == 'ios';
import Toolbar from './Toolbar'

const {FBAppInviteDialog} = NativeModules
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const {INVITE_FRIENDS_APP_LINK} = config;
const getPotentialsButtonEnabled = true;

@onlyUpdateForKeys(['hasPotentials','fetchingPotentials'])
@reactMixin.decorate(TimerMixin)
class PotentialsPlaceholder extends React.Component{
  constructor(){
    super()
    this.state = {loading: true}
  }

  componentDidMount(){
    this.startTimer()
    if(this.props.user.status == 'onboarded'){
      this.props.dispatch(ActionMan.fetchPotentials())
      this.setState({loading:false})

    }
  }

  componentDidUpdate(pState){
    if(this.state.loading && !pState.loading){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      this.startTimer()
    }
  }
  componentWillReceiveProps(nProps){
    if(!nProps.hasPotentials && this.props.hasPotentials){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      this.getMorePotentials()
    }
  }
  onDidShow(){
    this.props.onDidShow && this.props.onDidShow(true)
  }

  getMorePotentials(){
    this.props.dispatch(ActionMan.fetchPotentials())

  }

  openProfileEditor(){
    this.props.navigator.push(Router.getRoute('SettingsBasic', {
      style: styles.container,
      settingOptions: profileOptions,
    }));

  }

  openPrefs(){
    this.props.navigator.push(Router.getRoute('SettingsPreferences'));


  }

  startTimer(){


  }

  inviteFriends(){
    this.setState({loading: true})
    FBAppInviteDialog.show({applinkUrl: INVITE_FRIENDS_APP_LINK})
  }

  render(){
    const {user} = this.props;
    const attrs = ['drink', 'smoke', 'height', 'body', 'ethnicity', 'eye_color', 'hair_color'];
    const potentialsReturnedEmpty = this.props.potentialsReturnedEmpty;
    const userProfileIncomplete = attrs.reduce((acc, el) => {
      if(!user[el]){
        return true
      }else{
        return false
      }
    }, false);

    return (
      <FadeInContainer
        delayAmount={1000}
        duration={1500}
      >
        <Toolbar dispatch={this.props.dispatch} key={'tb'}/>

        <View
          style={[
            styles.dashedBorderImage,
            {
              height: DeviceHeight - 180,
              width: DeviceWidth,
              position: 'relative',
              alignItems: 'center',
              paddingTop: iOS ? 20 : 10,
              justifyContent: 'center',
              backgroundColor: colors.outerSpace,
              flex: 1,
              flexDirection: 'column',
              opacity: this.props.hasPotentials ? 0 : 1
            }
          ]}
        >
          <Image
            source={require('./assets/placeholderDashed@3x.png')}
            style={{
              alignSelf: 'stretch',
              height: DeviceHeight - 120,
              marginVertical: MagicNumbers.is4s ? MagicNumbers.screenPadding : 15,
              alignItems: 'center',
              width: DeviceWidth - 40,
              justifyContent: 'center',
              position: 'absolute',
              top:50,
              flex: 1,
              bottom: 0,
              left: 20,
              flexDirection: 'column',
            }}
            resizeMode={Image.resizeMode.stretch}
          >
            <Image
              source={require('./assets/tripppleLogo@3x.png')}
              style={{
                alignSelf: 'center',
                opacity: 1,
                height: 160,
                width: MagicNumbers.is4s ? DeviceWidth - MagicNumbers.screenPadding * 2 : DeviceWidth - 30,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: this.state.loading ? 50 : 10
              }}
              resizeMode={Image.resizeMode.contain}
            />


            {this.state.loading || this.props.fetchingPotentials ?
              <View style={{flex: 0, zIndex:999, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>

                <Text
                  style={{
                    color: colors.white,
                    fontSize: MagicNumbers.size18 + 2,
                    textAlign: 'center',
                    fontFamily: 'montserrat',
                    fontWeight: '800',
                  }}
                >{'LOOKING FOR MATCHES'}</Text>
                <Spinner />

              </View> : null }

            {/*userProfileIncomplete && !this.state.loading ?
              <View
                style={{
                  flexGrow: 0,
                  height:115,
                  alignSelf:'stretch',
                  alignItems:'center',
                  flexDirection:'column',
                  marginHorizontal:0
                }}
              >
                <Button
                  btnText={'COMPLETE YOUR PROFILE'}
                  labelText={'WANT MORE MATCHES?'}
                  loading={this.state.loading}
                  onTap={this.openProfileEditor.bind(this)}
                />
              </View> : null */
            }

            { getPotentialsButtonEnabled && !potentialsReturnedEmpty && (!this.state.loading && !this.props.fetchingPotentials) ?
              <View style={{flexGrow: 0,height:80,maxHeight:80,alignItems:'center',flexDirection:'column'}}>
                <Button
                  loading={this.state.loading}
                  btnText={'GET MORE MATCHES'}
                  labelText={'GO AHEAD, TREAT YOURSELF'}
                  labelPosition={'bottom'}
 style={{flexGrow: 0,height:80,maxHeight:80}}
                  onTap={this.getMorePotentials.bind(this)}
                />
              </View> : null
            }

             { potentialsReturnedEmpty && (!this.state.loading) ?
              <View style={{flexGrow: 0,height:115,maxHeight:115,alignItems:'center',flexDirection:'column'}}>
                <Button
                loading={this.state.loading}
                btnText={'ADJUST PREFERENCES'}
                labelText={'NO MORE USERS MATCH YOUR PREFERENCES'}
                labelPosition={'top'}
                onTap={this.openPrefs.bind(this)}
              /></View> : null
            }

            {!userProfileIncomplete && getPotentialsButtonEnabled && potentialsReturnedEmpty && !this.state.loading ?
              <View style={{flexGrow: 0,height:115,maxHeight:115,alignItems:'center',flexDirection:'column'}}>
                <Button
                  loading={this.state.loading}
                  btnText={'CHECK AGAIN'}
                  labelText={`WE'LL KEEP LOOKING`}
                  labelPosition={'top'}
                  onTap={this.getMorePotentials.bind(this)}
                />
              </View> : null
            }

            {!userProfileIncomplete && !potentialsReturnedEmpty && !getPotentialsButtonEnabled && !this.state.loading ?
              <View style={{flexGrow: 0,height:115,maxHeight:115,alignItems:'center',flexDirection:'column'}}>
                <Button
                btnText={'INVITE FRIENDS'}
                onTap={this.inviteFriends.bind(this)}
              /></View> : null
            }
          </Image>
        </View>
      </FadeInContainer>
    )
  }
}


const Spinner = () => (

  <ActivityIndicator
    style={{top: 0, height: 50, width: 50, marginVertical: 50}}
    color={colors.white20}
    animating
    size={'large'}
  />
);

const Button = ({labelText, labelPosition = 'top', btnText, onTap}) => (
  <View
    pointerEvents="box-none"
    style={{
      alignSelf: 'stretch',
      marginTop: 30,
      marginHorizontal: 0,
      paddingHorizontal: 0,
      flexGrow:1,
      height:80
    }}
  >
    {labelText && labelPosition == 'top' &&
    <Text
      style={{
        fontFamily: 'omnes',
        color: colors.rollingStone,
        fontSize: MagicNumbers.size18 - 2,
        textAlign: 'center',
        backgroundColor:'transparent'
      }}
    >{labelText}</Text>}

    <View
      pointerEvents="box-none"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 20,
        marginHorizontal: MagicNumbers.screenPadding
      }}
    >
      <Btn
        onPress={onTap}
        color={colors.dark}
        style={{
          flexGrow: 1,
          alignSelf: 'stretch',
          borderRadius: 5,
          borderWidth: 1,
          paddingVertical: 15,
          paddingHorizontal:20,
          borderColor: colors.white,

        }}
      >
        <Text
          style={{
            color: colors.white,
            textAlign: 'center',
            fontFamily: 'montserrat',
            fontWeight: '800'
          }}
        >
          {btnText}
        </Text>
      </Btn>
    </View>

    {labelText && labelPosition == 'bottom' &&
      <Text
        style={{
          marginTop: 20,
          color: colors.rollingStone,
          fontSize: MagicNumbers.size18 - 2,
          textAlign: 'center'
        }}
      >{labelText}</Text>}

  </View>
);

PotentialsPlaceholder.displayName = 'PotentialsPlaceholder'


const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
    potentialsReturnedEmpty: state.app.potentialsReturnedEmpty,
    fetchingPotentials: state.ui.fetchingPotentials
  }
}
const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(PotentialsPlaceholder)
