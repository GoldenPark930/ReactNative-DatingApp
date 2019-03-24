import {Platform} from 'react-native'
import RNDeviceInfo from 'react-native-device-info'

const systemVersion = RNDeviceInfo.systemVersion;
const iOS = Platform.OS == 'ios';

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {

    case 'TOGGLE_PERMISSION_SWITCH_LOCATION':

      return { ...state, location: !state.location };

    case 'TOGGLE_PERMISSION_SWITCH_LOCATION_ON':

      return { ...state, location: true };

    case 'TOGGLE_PERMISSION_SWITCH_LOCATION_OFF':

      return { ...state, location: false };

    case 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS':

      return { ...state, notifications: !state.notifications };

    case 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_ON':

      return { ...state, notifications: true };

    case 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_OFF':

      return { ...state, notifications: false };

    default:

      return state;
  }
}


const initialState = {
  location: !iOS && parseInt(systemVersion) < 6,
  notifications: !iOS
};
