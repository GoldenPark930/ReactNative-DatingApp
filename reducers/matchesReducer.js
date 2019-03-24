
export default function matchesReducer(state = initialState, action) {


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


    case 'GET_MATCHES_FULFILLED':
        const matches = action.payload;
        // if ( !matches || !Array.isArray(matches) ) return state;

        const matchesHash = Object.values(matches).reduce( ( acc, el, i ) => {
          if(Object.keys(el.users).length >= 3){
            acc[ el.match_id ] = el;
            acc[ el.match_id ].lastRead = Date.now()

          }
          return acc
        }, {})
        return {...state, ...matchesHash}

    default:

        return state;
    }
}


const initialState = { };
