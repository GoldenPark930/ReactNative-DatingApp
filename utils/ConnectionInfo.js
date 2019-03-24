import React from 'react';
import { NetInfo } from 'react-native'

export default class ConnectionInfo extends React.Component{
  componentWillMount(){
    NetInfo.isConnected.addEventListener('change', this._handleConnectivityChange.bind(this))

    NetInfo.addEventListener('change', this._handleConnectionInfoChange.bind(this))

  }
  componentDidMount() {
    // NetInfo.fetch().then(connectionInfo => this._handleConnectionInfoChange(connectionInfo))
    // NetInfo.isConnected.fetch().then(isConnected => this._handleConnectivityChange(isConnected))

  }

  componentWillUnmount() {
    NetInfo.removeEventListener('change', this._handleConnectionInfoChange.bind(this))
    NetInfo.isConnected.removeEventListener('change', this._handleConnectivityChange.bind(this))
  }

  _handleConnectionInfoChange(connectionInfo) {
    this.props.handleChange(connectionInfo,'connectionInfo')
  }

  _handleConnectivityChange(isConnected) {
    this.props.handleChange(isConnected,'isConnected')
  }
  render() {
    return null
  }
}
