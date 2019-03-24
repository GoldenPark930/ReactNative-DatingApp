import _ from 'lodash'

export default function LikeReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGOUT_FULFILLED':
    case 'ONBOARD_USER_NOW_WHAT_FULFILLED':
    case 'DECOUPLE_FULFILLED':
      return initialState

    case 'SWIPE_CARD_FULFILLED':

      let likeCount = Math.max(state.likeCount, 0);
      const actionSource = action.payload || {};
      if(actionSource.likeStatus == 'approve'){
        likeCount += 1;
      }
      return {
        ...state,
        likeCount,
        lastLiked: 0,
        relevantUser: actionSource.relevantUser || null
      }
    case 'SEND_LIKE_FULFILLED':

      return {
        ...state,
        likedUsers:  _.uniq([...state.likedUsers, parseInt(action.meta.likeUserId)]) ,
        fullCount: state.fullCount + 1
      }

    case 'GET_USERS_LIKED_FULFILLED':
      let newLikedUsers = (action.payload.usersLiked.replace(')','').substring(5, action.payload.length).split(' AND id!='));

      return {
        ...state,
        likedUsers: _.uniq([...state.likedUsers, ...newLikedUsers.map(s => parseInt(s))])

      }
    default:

      return state;
  }
}


const initialState = {
  likeCount: 0,
  fullCount: 0,
  likedUsers: []
};
