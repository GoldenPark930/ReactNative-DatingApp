import {REHYDRATE, REHYDRATE_ERROR} from 'redux-persist/constants'

export default function appReducer(state = initialState, action) {
  let newState = {};

  switch (action.type) {
    case REHYDRATE_ERROR:
      return {...state, booted: true, hydrateError: true}
    case REHYDRATE:
      return {...state, booted: true}

    case 'APP_INITIALIZE':
      return {...state, appInitialized: true}
    //case 'persist/REHYDRATE':
    // console.log(action)
    //  return {...state, booted: true}
    // return state
    case 'GET_COUPLE_PIN_FULFILLED':
      return {...state, couplePin: action.payload.pin}

    case 'VERIFY_COUPLE_PIN_FULFILLED':
      return {...state, coupling: {...state.coupling, ...action.payload}}

    case 'SHARE_COUPLE_PIN_FULFILLED':
      return {...state, coupling: {...state.coupling, sentInvite: true, ...action.payload }}

    case 'TOGGLE_SENT_INVITE':
      return {...state, coupling: {...state.coupling, sentInvite: null, inviteMethod: null}};

    case 'CONNECTION_CHANGE':
      return {...state, connection: {...state.connection, [action.payload.conn]: action.payload.connInfo }}

    case 'APP_STATE_CHANGE':

      return {...state, appState: action.payload}

    // explicitly know if response came back empty
    case 'GET_POTENTIALS_FULFILLED':
      const matches = action.payload;
      // console.log(matches);
      if(!matches) return state;
      if(!matches.length){
        return {...state, potentialsReturnedEmpty: true}
      }else{
        const nstate = {...state};
        if(nstate.potentialsReturnedEmpty){
          nstate.potentialsReturnedEmpty = null;
          delete nstate.potentialsReturnedEmpty;
        }
        return {...nstate}
      }
      return state;

    case 'SEND_LIKE_PENDING':
      return {
        ...state,
        sendingLike:true
      }

    case 'SEND_LIKE_FULFILLED':
      return {
        ...state,
        sendingLike:false
      }

    default:

      return state;
  }
}


const initialState = {

  visibility: null,
  version: null,
  network: null,
  potentialsReturnedEmpty: false,
  appInitialized: false,
  connection:{}
};
