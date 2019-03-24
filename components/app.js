import { StatusBar, View, Dimensions, NativeModules, Text, Platform, ActivityIndicator } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import { withNavigation} from '@exponent/ex-navigation';
import SplashScreen from 'react-native-splash-screen'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
// import RC from '../RemoteConfig'
import _ from 'lodash'
import pure from 'recompose/pure'
import AppNav from '../AppNav';
import ModalDirector from './modals/ModalDirector';
import Welcome from './screens/welcome/welcome';
import AppState from '../utils/AppState'
import ConnectionInfo from '../utils/ConnectionInfo'
import Notifications from '../utils/Notifications';
import colors from '../utils/colors'
import Analytics from '../utils/Analytics'
import ActionMan from '../actions/';
import Onboard from './Onboard'
import DeepLinkHandler from '../utils/DeepLinkHandler'
import {fireLogin} from '../fire'
import LikeSender from '../LikeSender'
import Router from '../Router'

const iOS = Platform.OS == 'ios';
const {RNUXCam} = NativeModules
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

@reactMixin.decorate(TimerMixin)
class App extends React.Component{
  constructor(){
    super()

    this.state = {
      loading: true
    }
  }

  componentWillMount(){
    if(this.props.loggedIn){
      this.props.dispatch(ActionMan.getUserInfo());
    }else if(!this.props.loggedIn && this.props.fbUser && this.props.fbUser.accessToken){
      // this.props.dispatch(ActionMan.loginWithSavedFbCreds(this.props.fbUser))

    }

  }

  componentDidMount(){
    SplashScreen.hide();

    if(this.props.user.id && this.props.auth.firebaseUser){
      this.props.dispatch(ActionMan.firebaseAuth(this.props.fbUser))

      this.props.dispatch(ActionMan.sessionToFirebase())
    }
  }


  componentWillReceiveProps(nProps){
    if(nProps.loadedUser && !this.props.loadedUser){

      this.props.dispatch(ActionMan.setHotlineUser(nProps.user))
      Analytics.identifyUser(nProps.user)

    }
     if(!this.state.initialized && nProps.booted){

      this.initialize(nProps)
    }
    if(this.state.initialized && this.props.appState != 'active' && nProps.appState == 'active'){
      SplashScreen.hide();

    }
   
    if(this.props.loadedUser && nProps.onboarded && !this.props.onboarded){
      this.props.dispatch(ActionMan.resetRoute('Potentials'))
    }else if(this.props.loadedUser && nProps.loggedIn && !this.props.loggedIn){
      this.props.dispatch(ActionMan.resetRoute('Onboard'))
    }

  }

  componentDidUpdate(pProps, pState){
    if(this.state.initialized && !pState.initialized){
      SplashScreen.hide();
      this.performInitActions()
      // Analytics.identifyUser(this.props.user)

    }
  }

  initialize(nProps){
    if(!this.state.initialized){
      this.setState({initialized: true})
    }
  }

  performInitActions(){

    const initActions = this.props.onboarded ? [
      'getUserInfo',
      'getPotentials',
      'getMatches',
      'getNewMatches',
      'getUsersLiked'

    ] : this.props.loggedIn ? ['getUserInfo'] : [];

    const {permissions} = this.props;


    // if(permissions.notifications){
    //   initActions.push('getPushToken')
    // }
    // RC.getValue('init_actions')
    //     .then(actions => {
    //       __DEV__ && console.log('init_actions', actions);
    //       // _.reject(actions.split(','), a => a == 'getLocation').forEach(ac => {
    //
    //       actions.split(',').forEach(ac => {
    //         this.props.dispatch(ActionMan[ac]())
    //       })
    //
    //     })
    //     .catch(err => {

    initActions.forEach(ac => {
      this.props.dispatch(ActionMan[ac]())
    })
        // })
    if(permissions.location != 'soft-denied'){
      this.props.dispatch(ActionMan.checkLocationPermission())
    }
    if(permissions.notifications != 'soft-denied'){
      this.props.dispatch(ActionMan.checkNotificationsPermission())
    }
    if(this.props.loggedIn && permissions.location && (iOS && permissions.location == 'authorized' || true)){
      this.props.dispatch(ActionMan.getLocation())
    }
    if(this.props.loggedIn && permissions.notifications && (iOS && permissions.notifications == 'authorized' || true)){
      this.props.dispatch(ActionMan.getPushToken())
    }
  }


  render(){
    return (
      <View style={{width: DeviceWidth, height: DeviceHeight, backgroundColor: colors.outerSpace}}>

        <ConnectionInfo
          handleChange={(connInfo,conn)=> this.props.dispatch({type: 'CONNECTION_CHANGE', payload: {conn, connInfo}})}
        />

        { this.props.user && this.props.user.id && <LikeSender />}

        <AppState dispatch={this.props.dispatch} />

        <DeepLinkHandler dispatch={this.props.dispatch} />

        <AppNav onboarded={this.props.onboarded} initialRoute={Router.getRoute(this.props.loggedIn ? this.props.onboarded ? 'Potentials' : 'Onboard' : 'Welcome')} />

        <ModalDirector />

        <Notifications />

      </View>
    )
  }
}

const Loading = () => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      width: DeviceWidth,
      height: DeviceHeight,
      backgroundColor: colors.outerSpace
    }}
  >
    <ActivityIndicator
      size="large"
      color={colors.white}
      animating
      style={{}}
    />
  </View>
)
const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  onboarded: state.user.status == 'onboarded',
  user: state.user,
  fbUser: state.fbUser,
  auth: state.auth,
  ui: {...state.ui, matchInfo: state.matches[state.ui.chat ? state.ui.chat.match_id : null]},
  loggedIn: state.auth && state.auth.api_key && state.auth.user_id,
  loadedUser: state.ui.loadedUser,
  push_token: state.device.push_token,
  exnavigation: state.exnavigation,
  savedCredentials: state.auth.savedCredentials,
  rehydrated: state.ui.rehydrated,
  appState: state.app.appState,
  booted: state.app.booted,
  permissions: state.permissions,
  loggingIn: state.ui.loggingIn
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)((App));
