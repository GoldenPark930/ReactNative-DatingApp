import React, { Component } from 'react'
import { View, Navigator } from 'react-native'
import NotificationCommander from '../utils/NotificationCommander'
import NotificationDisplayer from '../components/notifications/NotificationDisplayer'


class Notifications extends Component{
  constructor(props){
    super()
  }

  render(){
    return (
      <View style={{position:'absolute',top:0}}>
        <NotificationDisplayer  />
        <NotificationCommander />
      </View>
    )
  }
}
export default Notifications
