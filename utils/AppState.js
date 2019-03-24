import React from "react";
import { AppState, View } from 'react-native'

export default class AppVisibility extends React.Component{
  componentDidMount(){
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }
  componentWillUnmount(){
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }
  _handleAppStateChange(appState){

    this.props.dispatch({type:'APP_STATE_CHANGE',payload: appState})
  }
  render() {
    return <View style={{position:'absolute'}}/>
  }
}
