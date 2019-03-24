import {Share, NativeModules, Platform} from 'react-native'
import Promise from 'bluebird'
import FCM from 'react-native-fcm'
import RNHotline from 'react-native-hotline'
import api from '../utils/api'
import {fetchPotentials as fetchPotentialsAlgolia} from '../utils/algolia'
const iOS = Platform.OS == 'ios';

import firebase from 'firebase';
import {fireAuth, fireLogin, app} from '../fire'


const firedb = firebase.database();

export const firebaseAuth = (fbUser) => (dispatch, getState) => dispatch({

  type: 'FIREBASE_AUTH',
  payload: {
    promise: new Promise((resolve, reject) => {


      fireAuth(fbUser, dispatch)
  .then(resolve)
        .catch(reject);
    })
  }
})
export const sessionToFirebase = (params) => (dispatch, getState) => dispatch({

  type: 'SESSION_TO_FIREBASE',
  payload: {
    promise: new Promise((resolve, reject) => {

      const {device, location, user, auth} = getState();
      const key = app.database().ref('sessions').push({
        date: firebase.database.ServerValue.TIMESTAMP,
        latitude: location.latitude,
        longitude: location.longitude,
        device_type: device.model,
        user_id: user.id,
        firebase_user_id: auth.firebaseUser.uid
      }).key
      return app.database().ref('user_sessions').child(user.id)
      .update({
        [key]: true
      })
      .then(resolve)
      .catch(reject);
    })
  }
})

export const fetchPotentials = () => (dispatch, getState) => dispatch({

  type: 'FETCH_POTENTIALS',
  payload: {
    promise: new Promise((resolve, reject) => {
      const {user, ui} = getState();
      if(ui.fetchingPotentials){
        resolve(false)
      }
      const genders = user.relationship_status != 'single' ? ['looking_for_m', 'looking_for_f'] : ['looking_for_mf', 'looking_for_ff', 'looking_for_mm'];
      const gender = genders.reduce((acc, el) => {
        if(user[el]){
          acc += el.replace('looking_for_', '')
        }
        return acc
      }, '')

      const prefs = {
        relationshipStatus: user.relationship_status == 'single' ? 'couple' : 'single',
        gender: gender.length > 1 ? null : gender,
        minAge: user.match_age_min,
        maxAge: user.match_age_max,
        distanceMiles: user.match_distance || 25,
        coords: {lat: user.latitude, lng: user.longitude},
        id: user.id,
        partner_id: user.partner_id
      }
      const likes = [...getState().likes.likedUsers, ...Object.keys(getState().swipeQueue)];

      const page = getState().ui.potentialsPageNumber || 0;
      return fetchPotentialsAlgolia(prefs, likes, page).then(resolve).catch(err => {
        __DEV__ && console.log('err', err)
        reject(err)
      })

    })
  }
})


export const clearPotentials = () => (dispatch, getState) => dispatch({

  type: 'CLEAR_POTENTIALS',
  payload: {}
});


export const getPotentials = fetchPotentials;

export const selectCoupleGenders = (payload) => (dispatch, getState) => dispatch({ type: 'SELECT_COUPLE_GENDERS',
  payload,
})

export const fetchBrowse = ({filter, page, coords}) => (dispatch, getState) => dispatch({ type: 'FETCH_BROWSE',
  payload: new Promise((resolve, reject) => {
    const {likes} = getState();
    return api.browse({filter: filter.toLowerCase(), page, coords}).then(browseUsers => {
      const browse = Object.values(browseUsers).map(b => {
        if(likes.likedUsers.indexOf(b.user.id) > -1){
          b.liked = true;
          b.user.liked = true;
        }
        return b
      }).reduce((acc,el) => {
        acc[el.user.id] = el;
        return acc
      },{})
      resolve(browse)
    })
  }),
  meta: {filter, page}
})

export const SwipeCard = params => (dispatch, getState) => dispatch({ type: 'SWIPE_CARD',
  payload: new Promise((resolve, reject) => {
    const state = getState()

    if(state.likes.likeCount > 0 && state.permissions.notifications == 'undetermined'){
      dispatch(showInModal({
        component: 'NotificationsPermissions',
        passProps: {

        }
      }))
    }
    resolve(params)
  }),
});

export const ActionModal = match => dispatch => dispatch({ type: 'SHOW_ACTION_MODAL', payload: { match } });

export const showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

export const killModal = () => dispatch => dispatch({ type: 'KILL_MODAL', payload: { } });

export const pushChat = match_id => dispatch => dispatch({ type: 'PUSH_CHAT', payload: { match_id } });

export const popChat = match_id => dispatch => dispatch({ type: 'POP_CHAT'});

export const setHotlineUser = user => dispatch => dispatch({ type: 'SET_HOTLINE_USER',
  payload: {
    promise: new Promise((resolve, reject) => {
      __DEV__ && console.log('SET HOTLINE USER', user);
      const {id, firstname, email, gender, relationship_status, image_url, thumb_url, partner_id} = user;

      if(!iOS){
        RNHotline.init('f54bba2a-84fa-43c8-afa9-098f3c1aefae', 'fba1b915-fa8b-4c24-bdda-8bac99fcf92a').then(result => {
          RNHotline.setUser(`${id}`, firstname, email, relationship_status, gender, image_url, thumb_url, `${partner_id}`);
          resolve(true)
        })
      }else{
        RNHotline.setUser(`${id}`, firstname, email, relationship_status, gender, image_url, thumb_url, `${partner_id}`);
        resolve(true)
      }
    })
  }
})

export const showFaqs = () => dispatch => dispatch({ type: 'SHOW_FAQS',
  payload: {
    promise: new Promise((resolve, reject) => {
      if(iOS){
        // RNHotline.showFaqs()
        NativeModules.RNHotlineController.showFaqs()
        resolve(true)
      }else{
        RNHotline.showFaqs('DisplayFAQsAsGrid')
        resolve(true)

      }
    })
  }
})


export const showConvos = () => dispatch => dispatch({ type: 'SHOW_CONVOS',
  payload: {
    promise: new Promise((resolve, reject) => {
      if(iOS){
        RNHotline.showConvos()
        resolve(true)
      }else{
        RNHotline.showConvos()
        resolve(true)

      }
      // .then(resolve).catch(reject)
    })
  }
})

export const togglePotentialsPage = payload => dispatch => dispatch({ type: 'TOGGLE_POTENTIALS_PAGE', payload })

export const share = payload => dispatch => dispatch({ type: 'SHARE_COUPLE_PIN',
  payload: {
    promise: new Promise((resolve, reject) => {
      const { pin, messageText } = payload;

      Share.share({
        title: 'Join my couple!',
        message: `${messageText}`,
        url: `trippple://joincouple/${pin}`,
      }, {
        dialogTitle: 'Send your couple pin'
      })
      .then(ok => resolve(ok))
      .catch(err => reject(err))
    })
  }
});

export const receivePushToken = ({push_token, loggedIn}) => (dispatch, getState) => dispatch({ type: 'RECEIVE_PUSH_TOKEN',
  payload: {
    promise: new Promise((resolve, reject) => {
      if(getState().auth.api_key){
        dispatch({type: 'UPDATE_USER_PUSH_TOKEN', payload: api.updatePushToken({push_token})});
      }
      resolve(push_token)
    })
  }
})


export const getPushToken = () => dispatch => dispatch({ type: 'GET_PUSH_TOKEN',
  payload: {
    promise: new Promise((resolve, reject) => {
      FCM.getFCMToken().then(push_token => {
        dispatch(receivePushToken({push_token}))
        dispatch({type: 'SAVE_PUSH_TOKEN', payload: push_token})
      })
     .catch(err => {
       __DEV__ && console.log(err)
     })
    })
  }
})
