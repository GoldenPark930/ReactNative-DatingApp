import { PermissionsAndroid, Platform } from 'react-native'
import Promise from 'bluebird'
import Permissions from 'react-native-permissions'
import {getLocation} from '../location'

// const askLocation = Promise.promisify(navigator.geolocation.getCurrentPosition)

export default {checkLocationPermission, requestLocationPermission}

export const checkLocationPermission = () => dispatch => dispatch({ type: 'CHECK_LOCATION_PERMISSION',
  payload: new Promise((resolve, reject) => {
    Platform.select(check)()
      .then(permission => {
        if(!permission || permission == 'undetermined'){
          dispatch({type: 'LOADING_FULFILLED'})
        }else{
          dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_ON'})
        }
        resolve(permission)
      })
      .catch(err => {
        dispatch({type: 'LOADING_FULFILLED'})
        dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_OFF'})
        reject(err)
      })
  }),
});

export const requestLocationPermission = () => dispatch => dispatch({ type: 'REQUEST_LOCATION_PERMISSION',
  payload: new Promise((resolve, reject) => {
    Platform.select(request)()
      .then(permission => {
        if(!permission || permission == 'undetermined'){
          dispatch({type: 'LOADING_FULFILLED'})
        }else{
          dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_ON'})
          dispatch(getLocation())
        }
        dispatch({type: 'KILL_MODAL'})

        resolve(permission)
      })
      .catch(err => {
        dispatch({type: 'LOADING_FULFILLED'})
        dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_OFF'})
        resolve(err)
      })
  }),
});

const request = {
  async ios(){

    return Permissions.requestPermission('location')
      .then(response => {
        return response
      })

  },
  async android() {
    try{
      const granted = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location',
          message: ''
        }
      )
      return granted
    }catch(err) {
      // console.warn(err)
      throw new Error(err)
    }
  }
}

const check = {
  async ios(){

    try{
      const permission = await Permissions.getPermissionStatus('location')
      return permission

    }catch(err){
      // __DEV__ && console.warn(err);
      return err
    }
  },
  async android() {
    try{
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location',
          message: ''
        }
      )
      return granted
    }catch(err) {
      // console.warn(err)
      throw new Error(err)
    }
  }
}
