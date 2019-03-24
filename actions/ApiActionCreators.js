import _ from 'lodash';
import api from '../utils/api';
import { createAction, handleAction, handleActions } from 'redux-actions';
import { logOut } from './appActions';
import { fetchPotentials, showInModal } from './misc';

const apiActions = [
  'requestPin',
  'verifyPin',
  'fbLogin',
  'updateUser',
  'getMatches',
  'getNewMatches',
  'unMatch',
  'reportUser',
  'getNotificationCount',
  'getMessages',
  'createMessage',
  'sendLike',
  'decouple',
  'getCouplePin',
  'verifyCouplePin',
  'updatePushToken',
  'disableAccount',
  'getUserInfo',
  //'getPotentials',
  'uploadFacebookPic',
  'onboard',
  'verifyPin',
  'hideProfile',
  'showProfile',
  'browse',
  'getUsersLiked'
];

const endpointMap = apiActions.map(call => {
  const action = call.replace(/([A-Z])/g, ($1) => { return (`_${$1}`).toLowerCase() }).toUpperCase();
  return { action, call };
})

const ApiActionCreators = endpointMap.reduce((obj, endpoint) => {
  obj[endpoint.call] = (...params) => ((dispatch, getState) => dispatch({

    type: endpoint.action,
    meta: endpoint.call == 'sendLike' ? {
      ...params
    }[0] : params.map(p => p),
    payload: {
      promise: new Promise((resolve, reject) => {
        let shouldFetchUserInfo, shouldFetchPotentials, p;
        if (endpoint.call == 'onboard') {
          dispatch({type: 'KILL_MODAL', payload: true});
        }

        const user = getState().user;

        if (['uploadfacebookpic', 'decouple', 'verifycouplepin', 'updateuser','fblogin', 'onboard'].indexOf(endpoint.call.toLowerCase()) > -1) {
          shouldFetchUserInfo = true
        }

        if (['decouple', 'verifycouplepin', 'onboard','updateuser','fblogin'].indexOf(endpoint.call.toLowerCase()) > -1) {
          shouldFetchPotentials = true
        }

        if (endpoint.call == 'sendLike') {
          p = Object.values(params[0]);
        } else {
          p = params;
        }

        api[endpoint.call](...p)
        .then(x => {
          return resolve(x);
        })
        .then(ok => {
          if(shouldFetchUserInfo){
            dispatch({type: 'GET_USER_INFO', payload: api.getUserInfo()});
          }
        })
        .then(ok => {
          if(shouldFetchPotentials){
            dispatch({type: 'SHOULD_REFETCH_POTENTIALS'});
          }
        })
        .catch(err => {
          __DEV__ && console.log('CAUGHT ERR',err.status);
          if (err.status == '401') {
            dispatch(logOut());
            return reject(err);
          } else if (err.status == '500' || err.status == '502' || err.status == '504') {
            // dispatch(showInModal({component:'MaintenanceScreen', passProps:{}}));
            return reject(err);
          }
        })
      })
    }
  }))
  return obj;
}, {})

export default ApiActionCreators;
