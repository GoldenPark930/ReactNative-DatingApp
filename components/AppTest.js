/*
* @flow
*/


import React from "react";

import DeviceConfig from '../DeviceConfig'
import {Component} from "react";
import {AppRegistry, View, SnapshotViewIOS, Navigator, Dimensions, Image, NativeModules,Settings,Linking} from "react-native";
import Analytics from '../utils/Analytics'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import alt from '../flux/alt';
import AltContainer from 'alt-container/native';
import Welcome from './welcome/welcome';
import Main from './main';
import PendingPartner from './pendingpartner';
import ModalDirector from '../modals/ModalDirector'
import Onboarding from '../screens/registration/onboard'
import UserStore from '../flux/stores/UserStore';
import AppState from '../flux/stores/AppState';

import UserActions from '../flux/actions/UserActions';
import AppActions from '../flux/actions/AppActions';
import CheckMarkScreen from '../screens/CheckMark'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import NotificationActions from '../flux/actions/NotificationActions'

import Notifications from '../utils/Notifications';
import LoadingOverlay from './LoadingOverlay'
import PurpleModal from '../modals/PurpleModal'
import MaintenanceScreen from '../screens/MaintenanceScreen'
import colors from '../utils/colors'
import ImageFlagged from '../screens/ImageFlagged'
import url from 'url'
import TEST_ACCOUNTS from '../../TEST_ACCOUNTS.js'


class AppRoutes extends Component{

  constructor(props){
    super()
  }

  render(){
    var userStatus = this.props.user ? this.props.user.status : null;

    switch(userStatus){
      case 'verified':
        return <Onboarding
                key="OnboardingScreen"
                user={this.props.user}
                AppState={this.props.AppState}
                currentRoute={this.props.AppState.currentRoute}
              />
      case 'imageflagged':
        return <ImageFlagged
                AppState={this.props.AppState}
                user={this.props.user}
                />
      case 'pendingpartner':
      case 'onboarded':
        return <Main
                key="MainScreen"
                user={this.props.user}
                AppState={this.props.AppState}
                currentRoute={this.props.AppState.currentRoute}
              />
      case 'unknown':
      case null:
      default:
        return (<Welcome AppState={this.props.AppState} key={'welcomescene'} />)
    }
  }
}

AppRoutes.displayName = 'AppRoutes'

class TopLevel extends Component{
  constructor(props){
    super()
    this.state = {
      showOverlay: props.user ? false : true,
      showCheckmark: false,
    }

  }
  componentDidMount(){
    if(!this.props.user.status == 'onboarded'){
      Linking.addEventListener('url', this.handleCoupleDeepLink.bind(this))
    }
  }
  handleCoupleDeepLink(event){
    const deeplink = url.parse(event.url);

    Analytics.event('Interaction',{type: 'deeplink', name: deeplink.href})

    if(deeplink.host == 'join.couple'){
      const pin = deeplink.path.substring(1,deeplink.path.length);
      Settings.set({'co.trippple.deeplinkCouplePin': pin});
    }
  }
  componentWillReceiveProps(nProps){
    if(nProps && this.props.user && nProps.user &&  nProps.user.status == 'verified' && this.props.user.status != 'verified' && this.props.user.status != 'onboarded'){
      this.setState({showCheckmark:true,checkMarkCopy: {title: 'SUCCESS' }})
      this.setTimeout(()=>{
        this.setState({showCheckmark:false,checkMarkCopy:null})
      },3500);
    }

    if(nProps && this.props.user && nProps.user && nProps.user.status == 'onboarded' && this.props.user.status != 'onboarded'){
      Linking.removeEventListener('url', this.handleCoupleDeepLink.bind(this))
    }
  }

  render(){
    const user = this.props.user || {status:'unknown'}
    return (
      <View style={{flex:10,backgroundColor:colors.outerSpace, width:DeviceWidth,height:DeviceHeight}}>

        <ReachabilitySubscription/>
        <AppVisibility/>
        <Connectivity/>

        <AppRoutes
          user={user}
          AppState={this.props.AppState}
          currentRoute={this.props.AppState.currentRoute}
        />

        <ModalDirector
          user={user}

          AppState={this.props.AppState}
        />

        {(this.state.showCheckmark || this.props.AppState.showCheckmark) ?
          <CheckMarkScreen
            key="toplevelcheckmark"
            isVisible={true}
            checkMarkCopy={this.state.checkMarkCopy || this.props.AppState.checkMarkCopy || ''}
            checkmarkRequireButtonPress={this.props.AppState.checkmarkRequireButtonPress || false}
          /> : <View/> }

        <LoadingOverlay key="LoadingOverlay" isVisible={this.props.AppState.showOverlay || this.state.showOverlay} />

        <Notifications user={this.props.user} AppState={this.props.AppState} />

        {this.props.AppState.showMaintenanceScreen ? <MaintenanceScreen /> : null }


      </View>
    )
  }
}
TopLevel.displayName = 'TopLevel'


reactMixin(TopLevel.prototype, TimerMixin);



class AppTest extends Component{
  static displayName = 'AppTest';

  // constructor(props){
  //   super()
  // }
  // componentDidMount(){
  //   NotificationActions.resetBadgeNumber()
  // }
  render(){
    const TopLevelStores = {
      user: (props) => {
        return {
          store: UserStore,
          value: UserStore.getState().user
        }
      },
      AppState: (props) => {
        return {
          store: AppState,
          value: AppState.getAppState()
        }
      },
    }

    return (
          <AltContainer stores={TopLevelStores}>
            <TopLevel />
          </AltContainer>

    );
  }

}


module.exports = AppTest
