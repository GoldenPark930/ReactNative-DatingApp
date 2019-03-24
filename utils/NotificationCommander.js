import FCM, {FCMEvent} from 'react-native-fcm';
import { connect } from 'react-redux';
import React, {Component} from 'react';
import {View} from 'react-native';
import {withNavigation} from '@exponent/ex-navigation';
import uuid from 'uuid'
import colors from './colors'
import Analytics from './Analytics'
import ActionMan from '../actions/';
import Router from '../Router'


@withNavigation
class NotificationCommander extends Component{
  constructor(){
    super()

    this.state = {
      notifications: [],
      processing: false,
    }
  }
  componentDidMount(){
    const dispatch = this.props.dispatch.bind(this);
    const handleAction = this.handleAction.bind(this);
    this.notificationUnsubscribe = FCM.on(FCMEvent.Notification, (notification, ...x) => {
      __DEV__ && console.log('NOTIFICATION:', notification, x);
      if(notification && notification.type){
        handleAction(notification, x)
      }
    });

    this.refreshUnsubscribe = FCM.on(FCMEvent.RefreshToken, token => {
      __DEBUG__ && console.log('TOKEN:', token);
      if(token != this.props.pushToken){
        dispatch(ActionMan.receivePushToken({push_token: token, loggedIn: this.props.user.id ? true : false}))
      }
    });

    FCM.getFCMToken()
      .then(token => {
        __DEBUG__ && console.log('TOKEN:', token);
        if(token != this.props.pushToken){
          dispatch(ActionMan.receivePushToken({push_token: token, loggedIn: this.props.user.id ? true : false}))
        }
      });

    FCM.getInitialNotification()
      .then(notification => {
        __DEV__ && console.log(notification);
        if(notification && notification.type){
          this.handleAction(notification)
        }
      })
      // .catch(err => {
      //   __DEV__ && console.warn('initialnotificationerrror',err);
      // })
  }

  componentWillUnmount(){
    if(this.notificationUnsubscribe && typeof this.notificationUnsubscribe == 'function'){this.notificationUnsubscribe()}
    if(this.refreshUnsubscribe && typeof this.refreshUnsubscribe == 'function'){this.refreshUnsubscribe()}
  }

  openChat(match_id){
    this.props.navigator.push(Router.getRoute('Chat', {match_id}))
  }

  handleAction(notification){
    const moreNotificationAttributes = {
      uuid: uuid.v4(),
      receivedAt: Date.now(),
      viewedAt: null,
    }
    const newNotification = {...notification, ...moreNotificationAttributes }

    this.props.dispatch({type: 'RECEIVE_NOTIFICATION', payload: newNotification});

    if(notification.type == 'dispatch'){
      this.props.dispatch(ActionMan[notification.action_creator](notification.action_payload));
    }

    if(notification.opened_from_tray){
      this.props.chatOpen ?
        this.props.dispatch(ActionMan.replaceRoute('Chat',{...notification, fromNotification: true})) :
          this.props.dispatch(ActionMan.pushRoute('Chat',{...notification, fromNotification: true}));

    }else{
      this.props.handleNotification(newNotification);
    }
  }
  render(){
    if(!__DEV__) return false;

    const devStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: this.state.processing ? 5 : 2,
      height: this.state.processing ? 5 : 2,
      borderRadius: 1,
      backgroundColor: this.state.socketConnected ? colors.sushi : colors.mandy
    };

    return <View style={devStyles} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  auth: state.auth,
  notifications: state.notifications,
  pushToken: state.device.push_token,
  chatOpen: state.ui.chat && state.ui.chat.match_id ? state.ui.chat.match_id : false

})

const mapDispatchToProps = (dispatch) => ({
  handleNotification: (n) => dispatch(ActionMan.handleNotification(n)),
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCommander);
