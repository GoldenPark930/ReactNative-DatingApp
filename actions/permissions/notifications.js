import { Platform, PushNotificationIOS } from 'react-native'
import FCM from 'react-native-fcm';
import Promise from 'bluebird'
import Permissions from 'react-native-permissions'
import {getPushToken} from '../misc'

export default {checkNotificationsPermission, requestNotificationsPermission}

export const checkNotificationsPermission = () => dispatch => dispatch({ type: 'CHECK_NOTIFICATIONS_PERMISSION',
  payload: new Promise((resolve, reject) => {
    Platform.select(check)()
      .then(permission => {
        dispatch({type: 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_ON'})
        resolve(permission)
      })
      .catch(err => {
        dispatch({type: 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_OFF'})
        reject(err)
      })
  }),
});

export const requestNotificationsPermission = () => dispatch => dispatch({ type: 'REQUEST_NOTIFICATIONS_PERMISSION',
  payload: new Promise((resolve, reject) => {
    Platform.select(request)()
      .then(permission => {
        dispatch({type: 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_ON'})
        dispatch(getPushToken())
        return resolve(permission)
      })
      .catch(err => {
        dispatch({type: 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_OFF'})
        return reject(err)
      })
  }),
});

const request = {

  ios(){
    FCM.requestPermissions();
    return Permissions.requestPermission('notification').then(permission => {
      return permission

    })
  },

  android() {
    return new Promise((resolve, reject) => {
      resolve('true')
    })
  }
}

const check = {
  ios(){

    return Permissions.getPermissionStatus('notification').then(permission => {
      return permission

    })


  },
  android() {
    return new Promise((resolve) => {
      resolve('true')
    })
  }
}
