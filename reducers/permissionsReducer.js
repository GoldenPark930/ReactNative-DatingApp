import {Platform} from 'react-native'

export default function permissionsReducer(state = initialState, action) {
  switch (action.type) {

    case 'CHECK_LOCATION_PERMISSION_FULFILLED':
      return {...state, location: action.payload }
    case 'CHECK_NOTIFICATIONS_PERMISSION_FULFILLED':
      return {...state, notifications: action.payload }
    case 'CHECK_CONTACTS_PERMISSION_FULFILLED':
      return {...state, contacts: action.payload || true }
    case 'REQUEST_LOCATION_PERMISSION_FULFILLED':
      return {...state, location: action.payload ? true : false }
    case 'REQUEST_NOTIFICATIONS_PERMISSION_FULFILLED':
      return {...state, notifications: action.payload ? true : false }
    case 'REQUEST_CONTACTS_PERMISSION_FULFILLED':
      return {...state, contacts: action.payload || true }


    case 'SET_PERMISSION_SOFT_DENY':
      return {...state, [action.payload.permission]: 'soft-denied' }


    default:

      return state;
  }
}


const initialState = {
  location: null,
  notifications: Platform.select({android: true, ios: false}),
  contacts: null,

};
