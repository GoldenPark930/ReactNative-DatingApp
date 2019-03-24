import {REHYDRATE} from 'redux-persist/constants'

export default function uiReducer(state = initialState, action) {

  switch (action.type) {
    case REHYDRATE:
      return {...state, rehydrated: true };

    case 'SHOULD_REFETCH_POTENTIALS':
      return {...state, shouldFetchPotentials: true };

    case 'OPEN_PROFILE':
      return {...state, profileVisible: true };
    case 'CLOSE_PROFILE':
      return {...state, profileVisible: false };

    case 'KILL_MODAL':

      return {...state, activeModal: null, actionModal: null, lastModal: state.activeModal };

    case 'SHOW_IN_MODAL':

      return {...state, activeModal: action.payload.route };

    case 'SHOW_ACTION_MODAL':

      return {...state, actionModal: action.payload.match };

    case 'POP_CHAT':
    case 'CHAT_IS_CLOSED':

      return {...state, chat: null}

    case 'PUSH_CHAT':
    case 'CHAT_IS_OPEN':

      return {...state, chat: {open: true, match_id: action.payload.match_id}}

    case 'OPEN_DRAWER':

      return {...state, drawerOpen: true}

    case 'SET_DRAWER_OPEN':
      return {...state, drawerOpen: true}

    case 'SET_DRAWER_CLOSED':
      return {...state, drawerOpen: false}

    case 'EX_NAVIGATION.SET_CURRENT_NAVIGATOR':
      return {...state, currentIndex: action.index };

    // case 'EX_NAVIGATION.BATCH':
    case 'EX_NAVIGATION.PUSH':
      return {...state, currentIndex: state.currentIndex + 1 };
    case 'EX_NAVIGATION.POP':
      return {...state, currentIndex: state.currentIndex - 1 };

    case 'GET_USER_INFO_REJECTED':
    case 'GET_USER_INFO_FULFILLED':
    case 'LOGIN_WITH_FACEBOOK_FULFILLED':
      return {...state, loadedUser: true };

    case 'LOGIN_WITH_FACEBOOK_PENDING':
    case 'LOADING_PENDING':

      return {
        ...state,
        loggingIn: true
      }


    case 'ONBOARD_FULFILLED':
    case 'LOADING_FULFILLED':
    case 'LOGIN_WITH_FACEBOOK_FULFILLED':

      return {
        ...state,
        loggingIn: false
      }

    case 'LOG_OUT':
      return initialState

    case 'TOGGLE_POTENTIALS_PAGE':
      return {
        ...state,
        potentialsPage: action.payload ? 1 : 0
      }

    case 'FETCH_BROWSE_PENDING':
      return {...state, refreshingBrowse: true}

    case 'FETCH_BROWSE_FULFILLED':
      return {
        ...state,
        refreshingBrowse: false,
        [`browsePage${action.meta.filter}`]: state[`browsePage${action.meta.filter}`] + (action.payload && Object.keys(action.payload).length ? 1 : 0)
      }

    case 'FETCH_BROWSE_REJECTED':
      return {...state, refreshingBrowse: false}

    case 'CHANGE_BROWSE_FILTER':
      return {...state, browseFilter: action.payload}

    case 'FETCH_POTENTIALS_PENDING':
    case 'GET_POTENTIALS_PENDING':
      return {...state, fetchingPotentials: true, shouldFetchPotentials: false}

    case 'FETCH_POTENTIALS_REJECTED':
    case 'GET_POTENTIALS_REJECTED':
      return {...state, fetchingPotentials: false, shouldFetchPotentials: false}


    case 'FETCH_POTENTIALS_FULFILLED':
    case 'GET_POTENTIALS_FULFILLED':
      return action.payload ? (action.payload.matches.length ? {
        ...state,
        potentialsPageNumber: state.potentialsPageNumber + 1,
        fetchingPotentials:false,
        shouldFetchPotentials: false
      } : {
        ...state,
        fetchingPotentials:false,
        shouldFetchPotentials: false
      }) : state

    default:

      return state;
  }
}


const initialState = {
  chat: null,
  activeModal: null,
  potentialsPageNumber:0,
  profileVisible: false,
  drawerOpen: false,
  currentIndex: 0,
  loggingIn: false,
  potentialsPage: 0,
  browsePagenearby:0,
  browsePagenewest:0,
  browsePagepopular:0,
  browseFilter: 'newest',
  refreshingBrowse:false
};
