
export default function unreadReducer(state = initialState, action) {
let newState = {...state};

  switch (action.type) {


  case 'MARK_CHAT_READ':

    newState.realTotal = Math.ceil(state.realTotal - newState[action.payload.match_id],0);
    newState[action.payload.match_id] = 0;
    return newState

  case 'HANDLE_NOTIFICATION_NEW_MATCH':
    newState[action.payload.match_id] = 1;
    return newState;

  case 'HANDLE_NOTIFICATION_NEW_MESSAGE':
    newState[action.payload.match_id] = state[action.payload.match_id] + 1;
    newState.realTotal = state.realTotal + 1;
    return newState;

  case 'CLEAR_NEW_MATCH_NOTIFICATIONS':
   newState.realTotal = 0;
   return newState;


  case 'GET_NOTIFICATION_COUNT_FULFILLED':

    return {...state, ...action.payload}

  default:

    return state;
  }
}


const initialState = {
  realTotal : 0
};
