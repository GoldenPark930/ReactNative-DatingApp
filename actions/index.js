import { createAction, handleAction, handleActions } from 'redux-actions';
import * as fbActions from './facebook'
import * as appActions from './appActions'
import * as notificationActions from './notifications'
import * as miscActions from './misc'
import * as locationActions from './location'
import permissionsActions from './permissions'
import apiActions from './ApiActionCreators'

const ActionMan = {
  ...apiActions,
  ...fbActions,
  ...appActions,
  ...locationActions,
  ...notificationActions,
  ...miscActions,
  ...permissionsActions
}


export default ActionMan
