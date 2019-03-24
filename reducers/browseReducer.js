import { combineReducers } from 'redux-immutable';
import Immutable from 'immutable'

const initialState = new Immutable.OrderedMap()

function createBrowseReducer(filter = 'newest') {

  return function reducer(state = initialState, action) {

    switch (action.type) {
      case 'ONBOARD_FULFILLED':
      case 'VERIFY_COUPLE_PIN_FULFILLED':
      case 'HANDLE_NOTIFICATION_COUPLE_READY':
      case 'HANDLE_NOTIFICATION_DECOUPLE':
      case 'CLEAR_POTENTIALS':
        return initialState;

      case 'SEND_LIKE_FULFILLED':
        return action.meta.filter == filter ? state.mergeDeep({
          [action.meta.likeUserId]: {
            user: {
              ...state.toJS()[action.meta.likeUserId].user,
              liked: action.meta.likeStatus == 'approve',

            },
            likedAt: Date.now()
          }
        }) : state

      case 'FETCH_BROWSE_FULFILLED':
        if(action.meta.filter != filter) return state;
        return action.payload ? state.mergeDeep(action.payload) : state;

      default:
        return state;
    }
  }

}
const filters = ['newest', 'nearby', 'popular'];

export default combineReducers(filters.reduce((a, r) => ({...a, [`${r}`]: createBrowseReducer(r)}), {}))
