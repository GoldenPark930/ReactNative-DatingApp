/*
* @flow
*/
import firebase from 'firebase';
import {Platform} from 'react-native'

export const firebaseConfig = {
  apiKey: 'AIzaSyBwQ0d87ygSNxEpcxJSDxpH2e9sb0tpNE8',
  authDomain: 'trippple-93bbc.firebaseio.com',
  databaseURL: 'https://trippple-93bbc.firebaseio.com',
  googleAppID: `1:820434364878:${Platform.OS}:839f5cd266b5f573`
};

// // Get default app

export const app = firebase.initializeApp(firebaseConfig)

export const fireAuth = (fbUser, dispatch) => {

  const auth = firebase.auth;
  const cred = auth.FacebookAuthProvider.credential(fbUser.accessToken);
  return app.auth().signInWithCredential(cred)

}


export const fireLogin = (fbUser, dispatch) => {


  const auth = app.auth();

      __DEV__ && console.log(fbUser,auth);
        const credential = firebase.auth.FacebookAuthProvider.credential(fbUser.accessToken);
      __DEV__ && console.log(credential);
  auth.onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      __DEV__ && console.log(firebaseUser, fbUser,auth);
      if(fbUser && !isUserEqual(fbUser, firebaseUser)) {

        __DEV__ && console.log('have fbuser',credential);

        auth.signInWithCredential(credential)
          .then(firebaser => {
            __DEV__ && console.log('firebaser',firebaser);
            dispatch({ type: 'FIREBASE_AUTH', payload: firebaser })
          })
          .catch((error) => {
            __DEV__ && console.log('error',error);
            if(error) dispatch({ type: 'FIREBASE_AUTH_FAIL', payload: error });
          });
      }else{
        dispatch({ type: 'FIREBASE_AUTH_CONFIRM', payload: firebaseUser })
      }
    }
  }, app.auth);

}

const checkFireLoginState = async (fbUser, dispatch) => {
  // console.log(fbUser, 'fbUserfbUserfbUserfbUserfbUserfbUser');
  if(fbUser && !global.FIREBASE_AUTH_SUCCESS) {
    const firebaseUser = await fireLogin(fbUser, dispatch)
    global.FIREBASE_AUTH_SUCCESS = true
    dispatch({ type: 'FIREBASE_AUTH_SUCCESS', payload: firebaseUser })
  }else{
    // __DEV__ && console.warn('User is signed-out of Facebook.')
    // auth.signOut();
    dispatch({ type: 'FIREBASE_AUTH_FAIL', payload: 'User is signed-out of Facebook.' })
  }
}

function isUserEqual(facebookAuthResponse, firebaseUser) {
  let r = false;
  if(firebaseUser) {
    // console.log(firebaseUser);
    // const providerData = firebaseUser.providerData;
    // for(let i = 0; i < providerData.length; i++) {
    //   if(providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
    //       providerData[i].uid === facebookAuthResponse.userID) {
    //     // We don't need to re-auth the Firebase connection.
    //     r = true;
    //   }
    // }
    r = true //STUBBED
  }
  // console.log('isUserEqual', r);

  return r;
}


export default checkFireLoginState
