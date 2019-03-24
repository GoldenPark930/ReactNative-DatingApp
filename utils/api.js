import { Platform } from 'react-native';
import Promise from 'bluebird';
import Analytics from './Analytics';
import config from '../../config';
import DeviceInfo from './DeviceInfo';
import {
  fetchNewestBrowse,
  fetchPopularBrowse,
  fetchNearbyBrowse,
  fetchPotentials
} from './algolia';

const { SERVER_URL } = config;
const Device = DeviceInfo.get()
const VERSION = Device.app_version;
const iOSversion = Device.version;

class authError extends Error {
  constructor(init) {
    super(init);
    this.status = '401';
  }
}

class serverError extends Error {
  constructor(init) {
    super(init);
    this.status = init || '500';
  }
}

async function baseRequest(endpoint = '', payload = {}, resource = 'user') {
  const params = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-T3P-Api-Version': `2/${VERSION}/${iOSversion}`,
      'Accept-Language': Device.locale
    },
    body: JSON.stringify(payload)
  }

  const url = `${SERVER_URL}/${resource}/${endpoint}`;

  if (__DEV__) console.log(`API REQUEST ---->>>>> ${url}`, params);

  const res = await fetch(url, params);
  __DEV__ && console.log(res, '<------------------------');

  if (res.status == 504 || res.status == 502 || res.status == 500) {
    Analytics.err(res);
    return res.status;
  } else if (res.status == 401) {
    Analytics.err(res);
    return res.status;
  }

  const response = await res.json();
  if (__DEV__) console.log(`API RESPONSE ${response.status} <<<<<<---- ${endpoint}`, response);

  return Promise.try(() => ({...response.response}));
}

function publicRequest(endpoint, payload) {
  return baseRequest(endpoint, payload);
}

async function apiError(){
  //  throw new Error(401)
  throw new authError('unauthorized')
}
function authenticatedRequest(endpoint: '', payload: {}, resource, forceCredentials){
  const credentials = forceCredentials || global.creds;
  // if(__DEV__ && (!credentials || !credentials.api_key || !credentials.user_id)){
  //   console.info('Attempting to make authenticated request with no credentials')
  //   // throw new Error('Attempting to make authenticated request with no credentials')
  //   return apiError()
  //
  // }
  let authPayload = {...payload};

  if (!authPayload.api_key) {
    authPayload = {...authPayload,...credentials};
  }

  if (!authPayload.api_key) {
    throw new authError('999');
  }

  return baseRequest(endpoint, authPayload, resource).then(result => {
    if (result == '401') {
      throw new authError('401');
    } else if (result >= 500 && result < 600) {
      throw new serverError('500')
    }
    return result;
  })
}

const api = {
  requestPin(phone) {
    return publicRequest('request_security_pin', { phone });
  },
  verifyPin(pin, phone) {
    const payload = { pin, phone, device: DeviceInfo.get(), platform: Platform.OS || 'iOS' };
    return publicRequest('verify_security_pin', payload);
  },
  fbLogin(fbAuth) {
    const payload = {
      fb_oauth_code: fbAuth.accessToken,
      fb_user_id: fbAuth.userID,
      ...fbAuth,
      device: {...DeviceInfo.get(), name:'XXX'}
    }
    return publicRequest('fb_login', payload);
  },
  onboard(payload) {
    return authenticatedRequest('onboarded', payload);
  },
  updateUser(payload) {
    return authenticatedRequest('update', payload);
  },
  getUserInfo(creds) {
    return authenticatedRequest('info', {}, 'user', creds);
  },
  getMatches(page) {
    return authenticatedRequest('getMatches', {page});
  },
  getNewMatches(page) {
    return authenticatedRequest('getNewMatches', {page});
  },
  browse(params) {
    switch (params.filter) {
      case 'newest':
        return fetchNewestBrowse(params);
      case 'popular':
        return fetchPopularBrowse(params);
      case 'nearby':
        return fetchNearbyBrowse(params);
      default:
        __DEV__ && console.warn('No filter given to browse request');
    }
    throw new Error('No filter');
  },
  getFavorites(page) {
    return authenticatedRequest('getFavourites', {page});
  },
  toggleFavorite(match_id) {
    return authenticatedRequest('toggleMatch', {match_id});
  },
  unMatch(match_id) {
    return authenticatedRequest('unmatch', {match_id});
  },
  reportUser(to_user_id, to_user_type, reason) {
    return authenticatedRequest('report_user', {
      report_id: to_user_id,
      report_object: to_user_type,
      report_action: reason,
      to_user_id, // legacy ?
      to_user_type, // legacy ?
      reason // legacy ?
    });
  },
  getNotificationCount(shouldReset) {
    const payload = {};
    if (shouldReset) {
      payload.clearall = 1;
    }
    return authenticatedRequest('notification_totals', payload);
  },
  getMessages(payload) {
    if (!payload.match_id) {
      return false;
    }
    return authenticatedRequest('messages', {...payload, message_type: 'retrieve'});
  },
  createMessage(message, matchID) {
    const payload = {
      message_type: 'create',
      match_id: matchID,
      message_body: message,
    };
    return authenticatedRequest('messages', payload);
  },
  getPotentials(coordinates) {
    const defaults = {relationshipStatus: 'single', gender: 'f', distanceInMeters: 48280, minAge: 18, maxAge: 60, coords: null};
    return authenticatedRequest('potentials', {...coordinates});
  },
  getUsersLiked() {
    return authenticatedRequest('get_users_liked');
  },
  fetchPotentials(prefs) {
    return fetchPotentials(prefs);
  },
  sendLike(like_user_id, like_status, like_user_type, from_user_type) {
    return authenticatedRequest('likes', { like_status, like_user_id, like_user_type, from_user_type });
  },
  saveFacebookPicture(photo) {
    return publicRequest('save_facebook_picture', photo);
  },
  uploadFacebookPic(imgUrl) {
    return authenticatedRequest('', {photo_url: imgUrl}, 'uploads');
  },
  joinCouple(partner_phone): Promise{
    return authenticatedRequest('join_couple', { partner_phone });
  },
  decouple(): Promise{
    return authenticatedRequest('decouple', {});
  },
  getCouplePin(): Promise{
    return authenticatedRequest('couple_pin', { pin_action: 'request' });
  },
  verifyCouplePin(partner_pin): Promise{
    return authenticatedRequest('couple_pin', { pin_action: 'verify', pin: partner_pin });
  },
  getProfileSettingsOptions(): Promise{
    return publicRequest('get_client_user_profile_options');
  },
  sendContactsToBlock(data): Promise{
    return authenticatedRequest('process_phone_contacts', {data});
  },
  updatePushToken({push_token}): Promise{
    return authenticatedRequest('update', { fcm_token: push_token, ...DeviceInfo.get() });
  },
  disableAccount(): Promise{
    return authenticatedRequest('disable');
  },
  hideProfile(): Promise{
    return authenticatedRequest('update', { profile_visible: false });
  },
  showProfile(): Promise{
    return authenticatedRequest('update', { profile_visible: true });
  },
  async sendTelemetry(encodedTelemetryPayload: String): Promise{
    const authPayload = { ...credentials};
    const params = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-T3P-Api-Version': `2/${VERSION}/${iOSversion}`,
      },
      body: encodedTelemetryPayload
    };

    const res = await fetch(`${SERVER_URL}/telemetry`, params);

    try {
      if (!res.json && res.status == 401) {
        throw new Error('NO JSON')
      }
      const response = await res.json();
      __DEV__ && console.log(response);
      return response;
    } catch(err) {
      __DEV__ && console.error(err);
      return {error: err, status: res.status};
    }
  }
}

export default api;
