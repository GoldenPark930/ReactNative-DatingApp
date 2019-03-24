import _ from 'lodash'


export default function newMatchesReducer(state = initialState, action) {
  let matches

  switch (action.type) {
    case 'ONBOARD_FULFILLED':
    case 'VERIFY_COUPLE_PIN_FULFILLED':
    case 'HANDLE_NOTIFICATION_COUPLE_READY':
    case 'HANDLE_NOTIFICATION_DECOUPLE':

        return initialState;


      case 'REMOVE_MATCH':
        return {...state, [action.payload.matchID]: null }

      case 'UN_MATCH_PENDING':
        const newState = state;
        const matchId = action.meta[0];
        newState[matchId] = null;
        delete newState[matchId];
        return {...newState }


      case 'GET_NEW_MATCHES_FULFILLED':
        matches = action.payload;

        // if ( !matches || !Array.isArray(matches) ) return state;
        return Object.values(matches).reduce( ( acc, el, i ) => {
          if(Object.keys(el.users).length >= 3){
              acc[ el.match_id ] = el;
          }
          return acc
        }, {})


      case 'GET_MATCHES_FULFILLED':
        matches = action.payload;

        // if ( !matches || !Array.isArray(matches)  ) return state;
        const match_ids = _.map(matches,'match_id');
        const deltaMatches = _.reject(state,(m) => { return m.match_id in match_ids});
        return deltaMatches.reduce((acc,el,i) =>{
          if(Object.keys(el.users).length >= 3){
            acc[el.match_id] = el;
          }
          return acc
        },{})

      default:

        return state;
  }
}


const initialState = { };
