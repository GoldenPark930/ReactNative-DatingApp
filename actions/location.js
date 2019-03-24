import Permissions from 'react-native-permissions'
import api from '../utils/api'

const LOCATION_OPTIONS = {enableHighAccuracy: false, timeout: 100000, maximumAge: 100000}


export const getLocation = () => dispatch => dispatch({ type: 'GET_LOCATION',
  payload: {
    promise: new Promise((resolve, reject) => {

      Permissions.getPermissionStatus('location')
        .then(permission => {
          if(permission == 'authorized'){
            navigator.geolocation.getCurrentPosition(geo => {
              if(geo && geo.coords){
                dispatch({ type: 'GOT_LOCATION', payload: geo.coords})
                return api.updateUser(geo.coords)
                        .then((res) => {
                          __DEV__ && console.log(res, 'UPDATED LOCATION');
                          resolve(geo.coords)
                        })
                        .catch(err => {
                          __DEV__ && console.log(err, 'GOT_LOCATION but couldnt update');
                        })
              }
              return false
            }, err => {
              __DEV__ && console.log(err, 'LOCATION ERR');
            }, LOCATION_OPTIONS);
          }
        })
        .catch(err => reject(err))
    })
  }
});


export const checkLocation = (get) => dispatch => dispatch({ type: 'CHECK_LOCATION',
  payload: new Promise((resolve, reject) => {

    Permissions.getPermissionStatus('location')
      .then(permission => {
        if(permission == 'authorized') {
          if(get){
            dispatch(getLocation());
          }
          resolve(permission)
        }else if(permission == 'undetermined') {
          reject(permission)
        }else{
          reject(new Error('nopermission'));
        }
      });
  }),
});

export const geoIp = () => dispatch => dispatch({ type: 'GEO_IP',
  payload: new Promise((resolve, reject) => {
    fetch('http://freegeoip.net/json/')
      .then(res => res.json())
      .then(response => resolve(response))
      .catch(err => reject(err))
  })
});
