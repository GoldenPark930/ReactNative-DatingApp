import _ from 'lodash'

export default function swipeHistoryReducer(state = initialState, action) {
  const s = state
  switch (action.type) {
    case 'SEND_LIKE_FULFILLED':

      return {
        ...state,
        [action.meta.likeUserId]: {
          ...action.meta,
          ...action.payload,
          liked: action.meta.likeStatus == 'approve',
          likedAt: Date.now()
        }
      }

    default:

      return state;
  }
}


const initialState = {}
