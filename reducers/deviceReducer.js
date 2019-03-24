import DeviceInfo from '../utils/DeviceInfo'

const Device = DeviceInfo.get()

export default function deviceReducer(state = initialState, action) {
  switch (action.type) {

    case 'RECEIVE_PUSH_TOKEN_FULFILLED':
      return {...state, push_token: action.payload}

    case 'SAVE_PUSH_TOKEN':
      return {...state, push_token: action.payload}

    case 'LOG_OUT':
    case 'LOG_OUT_FULFILLED':

      return initialState;

    default:

      return state;
  }
}


const initialState = {
  push_token: null,

  uuid: Device.uuid,
  version: Device.version,
  platform: Device.platform,
  name: Device.name,
  locale: Device.locale,
  country: Device.country,
  model: Device.model,
  manufacturer: Device.manufacturer,
};
