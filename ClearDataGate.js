import React, { Component } from 'react';
import {Settings, View, Platform} from 'react-native'
// import UserDefaults from 'react-native-userdefaults-ios'
import LogOut from './utils/logout'
import NewBoot from './NewBoot'

const iOS = Platform.OS == 'ios';

class ClearDataGate extends Component{

  state = {
    noReset: false
  };

  componentWillMount(){
    //
    //
    // if(iOS){
    //   console.log(UserDefaults)
    //    UserDefaults.boolForKey('ResetDataOnLaunch', ResetDataOnLaunch => {
    //       __DEV__ && console.log('ResetDataOnLaunch', ResetDataOnLaunch)
    //
    //       if(ResetDataOnLaunch){
    //
    //         return LogOut().then((x) => {
    //           return UserDefaults.setBoolForKey(false,'ResetDataOnLaunch')
    //         })
    //         .then(result => {
    //           __DEV__ && console.log(result);
    //           this.setState({noReset: true})
    //
    //         })
    //       }else{
    //         this.setState({noReset: true})
    //       }
    //     })
    // }else{
    //   this.setState({noReset: true})
    //
    // }

  }

  render() {
    return  <NewBoot /> //this.state.noReset ? <NewBoot /> : <View/>
  }
}

export default ClearDataGate
