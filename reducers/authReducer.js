import {REHYDRATE} from 'redux-persist/constants'

export default function authReducer(state = initialState, action) {

    switch (action.type) {
    case REHYDRATE:
        let {auth} = action.payload;
        if(auth && auth.api_key && auth.user_id){
            let {api_key, user_id} = auth
            global.creds = { api_key, user_id }
        }
        return state

    case 'FIREBASE_AUTH':
    case 'FIREBASE_AUTH_FULFILLED':
        return { ...state, firebaseUser: action.payload}

    case 'VERIFY_PIN_REJECTED':
    case 'REQUEST_PIN_REJECTED':
    case 'LOGIN_WITH_FACEBOOK_REJECTED':
        return { ...state, error: action.payload }

    case 'INITIALIZE_CREDENTIALS':
        let {username,password} = action.payload || action.payload;

        const c = {
            api_key: password,
            user_id: username
        };

        if(c.api_key && c.user_id){
            global.creds = { api_key:c.api_key, user_id:c.user_id }
            return {
                ...state,
                ...global.creds,
            };
        }else{
            return state
        }

    case 'SAVE_CREDENTIALS_PENDING':
    case 'SAVE_CREDENTIALS_FULFILLED':
    case 'SAVED_CREDENTIALS_FULFILLED':
        return { ...state, savedCredentials: true }

    // case 'SAVED_CREDENTIALS_FULFILLED ':
    case 'VERIFY_PIN_FULFILLED':
    case 'LOGIN_WITH_FACEBOOK_FULFILLED':

        let {api_key,user_id} = action.payload;

        if(api_key && user_id){
            global.creds = { api_key, user_id }
            return {
                ...state,
                api_key,
                user_id,
            };
        }else{
            return { ...state }
        }


    case 'CLEAR_CREDENTIALS':
    case 'LOG_OUT_FULFILLED':
    case 'LOG_OUT':

        return initialState;

    default:

        return state;
    }
}


const initialState = {
    api_key: null,
    user_id: null,
    savedCredentials: false
};
