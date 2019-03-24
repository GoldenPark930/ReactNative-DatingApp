export default function facebookReducer(state = initialState, action) {

    switch (action.type) {

    case 'FACEBOOK_AUTH':
      return {...state, ...action.payload, loading: true};

    case 'ADD_FACEBOOK_PERMISSIONS':
    case 'FACEBOOK_AUTH_FULFILLED':
    case 'ADD_FACEBOOK_PERMISSIONS_FULFILLED':

        return {...state, ...action.payload, canceled: false};

    case 'LOGIN_WITH_FACEBOOK':
    case 'LOGIN_WITH_FACEBOOK_FULFILLED':
      if(action.payload && action.payload.accessToken){
        let payl = {...action.payload}
        delete payl.response
        delete payl.status
        return {...state, ...payl, canceled: false};
      }else{
        return {...state, canceled: true};

      }
    case 'GET_FACEBOOK_PROFILE':
    case 'GET_FACEBOOK_PROFILE_FULFILLED':
        return {...state, profile: action.payload};

    case 'GET_FACEBOOK_INFO':
    case 'GET_FACEBOOK_INFO_FULFILLED':

        return {...state, ...action.payload};

    case 'LOG_OUT':
    case 'LOG_OUT_FULFILLED':

        return initialState;

    default:

        return state;
    }
}


const initialState = {
    accessToken: null,
    permissions: [],
    declinedPermissions:[],
    applicationID: "367243980090932",
    userID: null,
    expirationTime:null,
    lastRefreshTime:null
};
