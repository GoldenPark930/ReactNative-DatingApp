
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation'
import React, { Component } from 'react'
import reactMixin from 'react-mixin'
import { View, Alert, AsyncStorage, AppState, PushNotificationIOS, VibrationIOS, Statusbar } from 'react-native'
import { connect } from 'react-redux'
import TimerMixin from 'react-timer-mixin'
import Notification from './NotificationTop'
import _ from 'lodash'
import ActionMan from '../../actions'

@withNavigation
class NotificationDisplayer extends Component {
  constructor(props) {
    super()
    this.state = {
      visible: true
    }

  }
  componentWillReceiveProps(nProps){
    // // if(nProps.notifications && nProps.notifications[0] && this.props.notifications && this.props.notifications[0] && nProps.notifications[0].uuid != this.props.notifications[0].uuid){
    //   this.setState({ visible: true })
    //   this.setNotificationGoAwayTimer(1000)
    // }
  }
  pushChat(chatProps){

    const payload = chatProps;

    this.props.chatOpen ?
      this.props.dispatch(ActionMan.replaceRoute('Chat',payload)) :
        this.props.dispatch(ActionMan.pushRoute('Chat',payload));
  }
  render() {
    const {notifications} = this.props;
    if (!notifications) return <View/>;
    const check = this.props.notifications[0] || null;

    return (
      <View>

        {notifications[0] &&
          <Notification
            user={this.props.user}
            key={`noti${notifications[0].uuid}`}
            visible={this.state.visible}
            pushChat={this.pushChat.bind(this)}
            notification={notifications[0]}
            dispatch={this.props.dispatch}
            chatOpen={this.props.chatOpen}

          />
        }
      </View>

    )
    //     return (
    //       <View>
    //       {notifications.map((noti,i)=>{
    //         return (<View style={{top:i*10}}><Notification
    //           user={this.props.user}
    //           key={'noti'+i}
    //           index={i}
    //           payload={notifications[i]}
    //         /></View>) })
    //       }
    //       </View>
    //     )

  }
}
// reactMixin(NotificationDisplayer, TimerMixin)


const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    notifications: _.filter(state.notifications,(n) => { return n && !n.viewedAt}),
    user: state.user,
    chatOpen: state.ui.chat && state.ui.chat.match_id ? state.ui.chat.match_id : false
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDisplayer);
