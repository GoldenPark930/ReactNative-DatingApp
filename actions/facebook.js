import FBSDK from 'react-native-fbsdk'
const {LoginManager, AccessToken, GraphRequestManager, GraphRequest} = FBSDK
import api from '../utils/api'
import checkFireLoginState from '../fire'
import {NavigationActions} from '@exponent/ex-navigation'
import Router from '../Router'
import {checkLocationPermission} from './permissions/location'

// LoginManager.setLoginBehavior('system_account')
const FACEBOOK_PERMISSIONS = [
  'email',
  'public_profile',
  'user_birthday',
  'user_friends',
  'user_likes',
  'user_location',
  'user_photos'
];

const FACEBOOK_PROFILE_FIELDS = [
  'email',
  'albums',
  'birthday',
  'name',
  'location',
  'friends',
  'photos',
  'likes',
  'about',
  'cover',
  'devices',
  'gender',
  'interested_in',
  'relationship_status',
  'significant_other',
  'timezone',
  'picture'
];

const parameters = { fields: { string: FACEBOOK_PROFILE_FIELDS.join(',') } }


/* loginWithFacebook | LOGIN_WITH_FACEBOOK */
export const loginWithFacebook = () => async (dispatch, getState) => {
  // LoginManager.setLoginBehavior('native')
  const fb = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS);
  dispatch({ type: 'FACEBOOK_RESPONSE', payload: fb})
  if(fb.isCancelled){
    dispatch({ type: 'FACEBOOK_LOGIN_ABORTED', payload: fb})

    return false
  }
  const fbAuth = await AccessToken.getCurrentAccessToken()
  const fbData = {...fb, ...fbAuth}
  dispatch({ type: 'LOGIN_WITH_FACEBOOK',
    payload: api.fbLogin(fbData).then(result => {
      __DEV__ && console.log(result);
      if(result.error){
        throw new Error(result.error)
      }
      dispatch({ type: 'FACEBOOK_AUTH', payload: fbData})
      dispatch({ type: 'FIREBASE_AUTH', payload: checkFireLoginState(fbData, dispatch) })
      // const state = getState()
      // const navs = Object.keys(state.navigation.navigators)
      // const navigatorUID = navs[0];
      // const onboarded = result.user_id && result.fb_authorized && result.user_info.status == 'onboarded';
      // dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute(onboarded ? 'Potentials' : 'Onboard')]));
      // dispatch(NavigationActions.popToTop(navigatorUID));

      // dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute(  'Potentials' )]));
      return result
    })
  })
  .catch(err => {
    __DEV__ && console.warn('fb login failed', err)
    // LoginManager.logOut()
  })
}
export const actuallyLoggedIn = () => (dispatch, getState) => dispatch({ type: 'ACTUALLY_LOGGED_IN',
  payload: new Promise((resolve, reject) => {


    const state = getState()
    const navs = Object.keys(state.navigation.navigators)
    const navigatorUID = navs[0];
    const onboarded = state.user.user_id && state.user.status == 'onboarded';
    dispatch(NavigationActions.replace(navigatorUID, Router.getRoute(onboarded ? 'Potentials' : 'Onboard')));
    dispatch(NavigationActions.popToTop(navigatorUID));

    // dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute(  'Potentials' )]));
    resolve()
  })
})


export const pushRoute = (route, params) => (dispatch, getState) => dispatch({ type: 'PUSH_ROUTE',
  payload: new Promise((resolve, reject) => {
    const state = getState()
    const navs = Object.keys(state.navigation.navigators)
    let navigatorUID = navs[0];
    if(navigatorUID == 'undefined'){
      navigatorUID = navs[1]
    }
    dispatch(NavigationActions.push(navigatorUID, Router.getRoute(route, params)));

    resolve(params)
  }),
});

export const resetRoute = (route, params = {}) => (dispatch, getState) => dispatch({ type: 'RESET_ROUTE',
  payload: new Promise((resolve, reject) => {
    const state = getState()
    const navs = Object.keys(state.navigation.navigators)
    const navigatorUID = navs[0];
    dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute(route, params)], 0));

    resolve(params)
  }),
});

export const replaceRoute = (route, params = {}) => (dispatch, getState) => dispatch({ type: 'REPLACE_ROUTE',
  payload: new Promise((resolve, reject) => {
    const state = getState()
    const navs = Object.keys(state.navigation.navigators)
    const navigatorUID = navs[0];
    dispatch(NavigationActions.replace(navigatorUID, Router.getRoute(route, params)));

    resolve(params)
  }),
});


export const loginWithSavedFbCreds = (fbData) => (dispatch, getState) => dispatch({ type: 'LOGIN_WITH_SAVED_FB_CREDS',
  payload: new Promise((resolve, reject) => {
    __DEV__ && console.log('loginWithSavedFbCreds', fbData);
    api.fbLogin(fbData).then(result => {
      dispatch({ type: 'FIREBASE_AUTH', payload: checkFireLoginState(fbData, dispatch) })
      const state = getState()
      const navs = Object.keys(state.navigation.navigators)
      const navigatorUID = navs[0];
      const onboarded = result.user_id && result.fb_authorized && result.user_info.status == 'onboarded';
      __DEV__ && console.log(result, onboarded);
      dispatch(NavigationActions.replace(navigatorUID, Router.getRoute(onboarded ? 'Potentials' : 'Onboard')));
      dispatch(NavigationActions.popToTop(navigatorUID));

      // dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute( onboarded ?  'Potentials' : 'OnboardModal')]));
      return result
    })

  })
})

export const onboardUserNowWhat = payload => (dispatch, getState) => dispatch({ type: 'ONBOARD_USER_NOW_WHAT',
  payload: new Promise((resolve, reject) => {
    api.onboard(payload).then(result => {
      const state = getState();
      __DEV__ && console.log(result);
      const navs = Object.keys(state.navigation.navigators)
      const navigatorUID = navs[0];
      // dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute('Potentials')]));

      resolve(result)

    })


  })
})


export const sessionAuth = () => async dispatch => {
  try{
    const fbUser = await AccessToken.getCurrentAccessToken()

    dispatch({ type: 'FACEBOOK_AUTH', payload: fbUser })
    dispatch({ type: 'FIREBASE_AUTH', payload: checkFireLoginState(fbUser, dispatch) })
  }catch(err){
    __DEV__ && console.log('3rdparty login failed', err)
  }
}


/* getFacebookInfo | GET_FACEBOOK_INFO */
export const getFacebookInfo = () => async dispatch => {
  try{
    const fbUser = await AccessToken.getCurrentAccessToken()
    dispatch({ type: 'GET_FACEBOOK_INFO', payload: fbUser })
    dispatch(getFacebookProfile(fbUser))
  }catch(err){
    __DEV__ && console.log('No fb access token found', err)
  }
}

/* facebookAuth | FACEBOOK_AUTH */
export const facebookAuth = () => async dispatch => {
  try{
    const fb = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS)
    const fbUser = await AccessToken.getCurrentAccessToken()

    dispatch({ type: 'FACEBOOK_AUTH', payload: {...fb, ...fbUser} })
  }catch(err){
    __DEV__ && console.log('facebookAuth FACEBOOK_AUTHfb login failed', err)
  }
}

/* getFacebookProfile | GET_FACEBOOK_PROFILE */
export const getFacebookProfile = fbUser => dispatch => {
  const {accessToken} = fbUser;

  const infoRequest = new GraphRequest('me', {parameters, accessToken}, (err, fbProfile) => {
    if(err){
      __DEV__ && console.log('error getting fb profile', err);
      return
    }
    dispatch({ type: 'GET_FACEBOOK_PROFILE', payload: fbProfile })
  });

  const REQ = new GraphRequestManager().addRequest(infoRequest)
  REQ.start();
}


/* fetchFacebookAlbums | FETCH_FACEBOOK_ALBUMS */
export const fetchFacebookAlbums = fbUser => dispatch => dispatch({ type: 'FETCH_FACEBOOK_ALBUMS',
  payload: {
    promise: new Promise((resolve, reject) => {

      const {accessToken} = fbUser;
      const fbUrl = `https://graph.facebook.com/v2.8/${fbUser.userID}/albums?access_token=${fbUser.accessToken}&fields=id,photos{images},name,link,picture{url},count`;

      return fetch(fbUrl).then(res => {
        __DEV__ && console.log(res);
        return res.json()
      })
        .then(responseData => {
          __DEV__ && console.log(responseData);
          resolve(responseData)
        })
    })
  }
})

  // const infoRequest = new GraphRequest('me', {parameters, accessToken}, (err, fbProfile) => {
  //   if(err){
  //     __DEV__ && console.log('error getting fb profile', err);
  //     return
  //   }
  //   dispatch({ type: 'GET_FACEBOOK_ALBUMS', payload: fbProfile })
  // });
  //
  // const REQ = new GraphRequestManager().addRequest(infoRequest)
  // REQ.start();
// }


export const addFacebookPermissions = () => async dispatch => {
  try{
    const fb = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS)
    const fbUser = await AccessToken.getCurrentAccessToken()

    dispatch({ type: 'ADD_FACEBOOK_PERMISSIONS', payload: {...fb, ...fbUser} })
  }catch(err){
    __DEV__ && console.log('fb login failed', err)
  }
}
