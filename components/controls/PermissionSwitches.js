import React from 'react'
import reactMixin from 'react-mixin'
import { Text, View, Switch, Settings, PushNotificationIOS, Platform, NativeModules, Dimensions } from 'react-native'
import {connect} from 'react-redux'
import ActionMan from '../../actions/'
import Analytics from '../../utils/Analytics'

import colors from '../../utils/colors'
import styles from '../screens/settings/settingsStyles'

// const DeviceHeight = Dimensions.get('window').height
// const DeviceWidth = Dimensions.get('window').width
const iOS = Platform.OS == 'ios';

class PermissionSwitches extends React.Component{
  constructor(props){
    super()
    this.state = { }
  }

  toggleLocation(){
    const {permissions, settings} = this.props

    Analytics.event('Interaction', {
      name: 'Toggle location permission',
      type: 'tap',
    })

    if(!permissions.location || permissions.location == 'undetermined'){
      this.props.dispatch(ActionMan.showInModal({
        component: 'LocationPermissions',
        name: 'LocationPermissionModal',
        passProps: {
          title: 'PRIORITIZE LOCAL',
          subtitle: 'Should we prioritize the matches closest to you?',
          failedTitle: 'LOCATION DISABLED',
          failedSubtitle: 'Geolocation is disabled. You can enable it in your phone’s Settings.',
          headerImageSource: 'iconDeck',
          btnText: 'YES'
        }
      }))
    }else if(permissions.location && settings.location){
      this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_OFF'})
    }else if(permissions.location){
      this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_ON'})
      this.props.dispatch(ActionMan.getLocation())
    }
  }
  toggleNotification(){
    const {permissions, settings} = this.props

    if(iOS && !permissions.notifications || permissions.notifications == 'undetermined'){
      this.props.dispatch(ActionMan.showInModal({
        component: 'NotificationsPermissions',
        passProps: { }
      }))
    }else if(settings.notifications){
      this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_OFF'})
    }else{
      this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_ON'})
    }
  }

  render(){
    const {permissions, settings} = this.props;

    const locationValue = permissions.location && settings.location;
    const notificationsValue = iOS ? (permissions.notifications && settings.notifications) : settings.notifications;

    return (
      <View style={{paddingBottom: 30}}>
        <View style={[styles.paddedSpace, {marginBottom: 15}]}>
          <View style={styles.formHeader}>
            <Text style={styles.formHeaderText}>{'Location'}</Text>
          </View>
          <View style={[styles.insideSelectable, styles.formRow, {borderBottomWidth: 0}]}>
            <Text style={{color: colors.white, fontFamily:'omnes',fontSize: 18}}>Prioritize Users Near Me</Text>
            <Switch
              onValueChange={this.toggleLocation.bind(this)}
              value={locationValue}
              onTintColor={colors.dark}
              thumbTintColor={locationValue ? colors.mediumPurple : colors.shuttleGray}
              tintColor={colors.dark}
            />
          </View>
        </View>
        <View style={[styles.paddedSpace, {marginBottom: 15}]}>
          <View style={styles.formHeader}>
            <Text style={styles.formHeaderText}>{'Notifications'}</Text>
          </View>
          <View style={[styles.insideSelectable, styles.formRow, {borderBottomWidth: 0}]}>
            <Text style={{color: colors.white, fontFamily:'omnes',fontSize: 18}}>Get notifications</Text>
            <Switch
              onValueChange={this.toggleNotification.bind(this)}
              value={notificationsValue}
              onTintColor={colors.dark}
              thumbTintColor={notificationsValue ? colors.mediumPurple : colors.shuttleGray}
              tintColor={colors.dark}
            />
          </View>
        </View>
      </View>
        )
  }
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  permissions: state.permissions,
  settings: state.settings
})


const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(PermissionSwitches);
