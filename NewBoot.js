import React, { Component } from 'react';
import {Settings, View, Platform} from 'react-native'
import TouchID from 'react-native-touch-id'
import LockFailed from './components/LockFailed'
import AppContainer from './AppContainer'
import configureStore from './store';
import {sessionAuth} from './actions/facebook'


const store = configureStore();
const iOS = Platform.OS == 'ios';

class NewBoot extends Component{

  state = {
    booted: false,
    locked: iOS ? Settings._settings.LockedWithTouchID : false,
    initialized: false
  };

  componentWillMount(){
    if(this.state.locked){
      this.checkTouchId()
    }
    if(!this.state.initialized) this.initialize()
  }

  initialize(){
    this.setState({initialized: true})
    // store.dispatch(sessionAuth())
  }

  checkTouchId(){
    TouchID.authenticate('Access Trippple')
      .then(success => {
        __DEV__ && console.log(success, 'success');

        this.setState({
          lockFailed: false,
          locked: false
        })
      })
      .catch(error => {
        __DEV__ && console.log('error', error);
        this.setState({
          lockFailed: true
        })
      });
  }

  render() {
    if(this.state.lockFailed){ return <LockFailed retry={this.checkTouchId.bind(this)} /> }

    return this.state.locked || !this.state.initialized ? <View /> : <AppContainer store={store} />
  }
}

export default NewBoot
