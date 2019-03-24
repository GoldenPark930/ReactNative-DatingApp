import _ from 'lodash'

export default function swipeQueueReducer(state = initialState, action) {
  const s = state;
  let newState
  switch (action.type) {
    case 'SEND_LIKE_FULFILLED':
      if(s[action.meta.likeUserId]){
        delete(s[action.meta.likeUserId])
      }
      return s

    case 'SWIPE_CARD_FULFILLED':
      return {
        ...state,
        [action.payload.likeUserId]: {
          ...action.payload,
          swipedAt: Date.now(),
          liked: action.payload.likeStatus == 'approve'
        }
      }

    default:

      return state;
  }
}


const initialState = {}
