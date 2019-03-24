
export default function notificationsReducer(state = initialState, action) {

  switch (action.type) {

      case 'DISMISS_ALL_NOTIFICATIONS':
        const c = state.map(n => {
          if(n && !n.viewedAt){
            n.viewedAt = Date.now()
          }
          return n
        })
        return c

      case 'DISMISS_NOTIFICATION':
        return state.slice(1,state.length)

      case 'CLEAR_ALL_NOTIFICATIONS':
        return initialState;

      case 'CLEAR_NEW_MATCH_NOTIFICATIONS':
        return state.filter(n => n.type != 'new_match')

      case 'ENQUEUE_NOTIFICATION':

        const newNotification = {...action.meta, ...action.payload}
        return [newNotification, ...state];

      case 'RECEIVE_NOTIFICATION':
      case 'RECEIVE_NOTIFICATION_FULFILLED':
      case 'HANDLE_NOTIFICATION':
      case 'HANDLE_NOTIFICATION_FULFILLED':
        return state;

      default:

        return state;
  }
}


const initialState = [];
