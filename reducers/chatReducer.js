
export default function chatReducer(state = initialState, action) {
  let msgs

  switch (action.type) {
      case 'CREATE_MESSAGE_PENDING':
        if(!action.meta) return state
        let match_idd = action.meta[1]
        let msg = action.meta[0]
        let msgpayload = {
          created_timestamp: Date.now(),
          message_body: msg,
          from_user_info: {
            name: 'You',
            id: global.creds.user_id,
            match_id: match_idd
          },
          ephemeral: true,
          matchId: match_idd,
          id:  action.meta[2]
        }

        return {...state, [match_idd]: [ ...state[match_idd], msgpayload ] }

      case 'CREATE_MESSAGE_REJECTED':
      // let match_id = action.payload.match_id
      // return {...state, [match_id]: [...state[match_id], ] }
        return state

      case 'CREATE_MESSAGE_FULFILLED':
          // console.warn(action.meta);
        // let match_id = action.meta[1];
        // return {...state, [match_id]: [...state[match_id]] }
        return state
      case 'GET_MESSAGES_FULFILLED':
        if ( !action.payload ) return state;
        return {
          ...state,
          [action.payload.match_id]: action.payload.message_thread
        }
      case 'GET_NEW_MATCHES_FULFILLED':
      case 'GET_MATCHES_FULFILLED':
        if ( !action.payload || !Array.isArray(action.payload) ) return state;
        msgs = action.payload;
        const ids = msgs.reduce((acc,el,i)=>{
          acc[el.match_id] = [];
          return acc
        },{})
        return {...ids , ...state}

      default:

        return state;
  }
}


const initialState = {

};
