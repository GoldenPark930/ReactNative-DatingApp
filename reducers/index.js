import { NavigationReducer as navigation } from '@exponent/ex-navigation'
import { combineReducers } from 'redux';
import LikeReducer from './LikeReducer'
// import appNavReducer from './appNavReducer'
import appReducer from './appReducer'
import authReducer from './authReducer'
import chatReducer from './chatReducer'
import deviceReducer from './deviceReducer'
import facebookReducer from './facebookReducer'
import facebookAlbums from './facebookAlbums'
import matchesListReducer from './matchesListReducer'
import matchesReducer from './matchesReducer'
import nagReducer from './nagReducer'
import newMatchesReducer from './newMatchesReducer'
import notificationsReducer from './notificationsReducer'
import potentialsReducer from './potentialsReducer'
import cityStateReducer from './cityStateReducer'
import uiReducer from './uiReducer'
import unreadReducer from './unreadReducer'
import userReducer from './userReducer'
import permissionsReducer from './permissionsReducer'
import settingsReducer from './settingsReducer'
import swipeQueueReducer from './swipeQueueReducer'
import swipeHistoryReducer from './swipeHistoryReducer'
import browseReducer from './browseReducer'
import Immutable from 'immutable'

import locationReducer from './locationReducer'

const applicationReducers = ({
  user:           userReducer,
  device:         deviceReducer,
  app:            appReducer,
  auth:           authReducer,
  ui:             uiReducer,
  fbUser:         facebookReducer,
  unread:         unreadReducer,
  location:       locationReducer,
  matches:        matchesReducer,
  cityState:      cityStateReducer,
  newMatches:     newMatchesReducer,
  matchesList:    matchesListReducer,
  potentials:     potentialsReducer,
  messages:       chatReducer,
  notifications:  notificationsReducer,
  likes:          LikeReducer,
  permissions:    permissionsReducer,
  settings:       settingsReducer,
  navigation: navigation,
  swipeQueue: swipeQueueReducer,
  swipeHistory: swipeHistoryReducer,
  browse: browseReducer,
  // browseNearby: browseReducer,
  // browsePopular: browseReducer,
  facebookAlbums
})

export default function createReducer() {
  return combineReducers(applicationReducers);
}
