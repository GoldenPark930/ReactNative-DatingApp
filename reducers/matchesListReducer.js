import _ from 'lodash'

export default function matchesListReducer(state = initialState, action) {
  let matches

  switch (action.type) {
  case 'ONBOARD_FULFILLED':
  case 'VERIFY_COUPLE_PIN_FULFILLED':
  case 'HANDLE_NOTIFICATION_COUPLE_READY':
  case 'HANDLE_NOTIFICATION_DECOUPLE':

    return initialState;


  case 'REMOVE_MATCH':
  case 'UN_MATCH_PENDING':
    const matchId = action.meta[0];
    const newNewMatches = _.filter(state.newMatches, (m) => m.match_id != matchId);
    const newRegularMatches = _.filter(state.matches, (m) => m.match_id != matchId);
    return {matches: newRegularMatches, newMatches: newNewMatches }

  case 'GET_NEW_MATCHES_FULFILLED':
    if( !action.payload ) return state;
    matches = action.payload

    return {
      ...state,
      newMatches: _.filter(matches, m => Object.keys(m.users).length >= 1)
    }


  case 'GET_MATCHES_FULFILLED':
    matches = action.payload;

    if( !matches ) return state;


    const oldM = state.matches.reduce((acc,el)=>{
      acc[el.match_id] = el
      return acc
    },{});

    const newM = Object.values(matches).reduce((acc,el)=>{
      acc[el.match_id] = el
      return acc
    },{})

    const mtchs = {...oldM, ...newM}

    const newMatches = _.difference(state.newMatches, matches);

    return {
      newMatches: _.filter(newMatches, (m) => Object.keys(m.users).length >= 3),
      matches: orderMatches(Object.values(mtchs))
    };

  //
  // case 'GET_MESSAGES_FULFILLED':
  //   console.warn('messages',action.payload);
  //   if( !action.payload ) return state;
  //
  //   const ma = state.matches[action.payload.match_id];
  //   ma.recent_message = action.payload
  //   return {
  //     newMatches: _.difference(state.newMatches, action.payload),
  //     matches: mtchs.length > 1 ? orderMatches(mtchs) : mtchs
  //   };
  //

  default:

    return {...state};
  }
}


const initialState = {
  newMatches: [],
  matches: []
};

function dedupe(matches){
  return _.uniqBy(matches, m => m.match_id)
}

function orderMatches( matches ) {
  const sortableMatches = matches;

  return sortableMatches.sort( ( a, b ) => {
    const aTime = a.recent_message && a.recent_message.created_timestamp
    const bTime = b.recent_message && b.recent_message.created_timestamp
    if ( aTime < bTime ) {
      return 1;
    } else if ( aTime >= bTime ) {
      return -1;
    }
    return 0;
  });

}
