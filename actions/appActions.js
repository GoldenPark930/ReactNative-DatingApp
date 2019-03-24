
import { Platform,NativeModules} from 'react-native';
const {RNKeychainManager} = NativeModules

import userDefaults from '../utils/userDefaults';
import {NavigationActions} from '@exponent/ex-navigation'
import Router from '../Router'

import config from '../../config';
import doLogOut from '../utils/logout';
import Telemetry from '../utils/AppTelemetry';

const { KEYCHAIN_NAMESPACE } = config;
const iOS = Platform.OS == 'ios';

export const checkResetDataOnLaunch = () => dispatch => dispatch({ type: 'CHECK_USER_DEFAULTS',
  payload: new Promise((resolve, reject) => {
    if(iOS){

    }else{
      return (async () => {})()
    }
  })
})


export const saveCredentials = (credentials) => dispatch => dispatch({ type: 'SAVE_CREDENTIALS',
  payload: new Promise((resolve, reject) => {
    let { user_id, api_key } = credentials || global.creds;
    RNKeychainManager.setInternetCredentialsForServer(KEYCHAIN_NAMESPACE, `${user_id}`, api_key)
      .then(resolve).catch(reject);
  }),
});

export const logOut = () => (dispatch,getState) => dispatch({ type: 'LOG_OUT',
  payload: new Promise((resolve, reject) => {
    doLogOut()
    .then(x => {
      global.creds = null;
      const state = getState()
      const navi = state.navigation || {}
      const navs = Object.keys(navi.navigators)
      const navigatorUID = navs[0];
      dispatch({type:'CLOSE_DRAWER'})
      dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute('Welcome')],0));
      resolve(x)
    })
    .catch(reject);
  }),
});

export const screenshot = () => dispatch => dispatch({ type: 'CAPTURE_SCREENSHOT',
  payload: new Promise((resolve, reject) => {
    UIManager.takeSnapshot('window', { format: 'jpeg', quality: 0.8 })
      .then(resolve)
      .catch(reject);
  }),
});

export const sendTelemetry = () => dispatch => dispatch({ type: 'SEND_TELEMETRY',
  payload: new Promise((resolve, reject) => async() => {
    try {
      const Telemetry = await AppTelemetry.getEncoded();
      return resolve(await Api.sendTelemetry(Telemetry));
    } catch (err) {
      return reject(err);
    }
  }),
});
