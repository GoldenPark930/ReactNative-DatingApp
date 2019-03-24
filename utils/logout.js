import Promise from 'bluebird'
import { AsyncStorage, NativeModules } from 'react-native'
import * as Keychain from 'react-native-keychain';
import config from '../../config'

const {FBLoginManager} = NativeModules
const {KEYCHAIN_NAMESPACE} = config

async function Logout(){
  global.creds = null;
  return Promise.all([
    // Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE),
    AsyncStorage.clear(),
    FBLoginManager.logOut()
  ])
}

export default Logout
