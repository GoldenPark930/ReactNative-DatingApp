// import  from '@exponent/ex-navigation'
import React from 'react'
import { Image, TouchableHighlight, TouchableOpacity, PanResponder, Easing, StatusBar, View, StyleSheet, Text, Animated, Dimensions, VibrationIOS, Platform } from 'react-native'
import { BlurView } from 'react-native-blur'
import ActionMan from '../../actions'
import colors from '../../utils/colors'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'


const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const iOS = Platform.OS == 'ios';

const NOTI_HEIGHT = 70;

@reactMixin.decorate(TimerMixin)
class Notification extends React.Component{

  constructor(props){
    super()
    this.state = {
      yValue: new Animated.Value(-220),
      pan: new Animated.ValueXY(),

    }
    this._timer = null;
    this._panResponder = {}
  }
  componentWillMount(){
    __DEBUG__ && iOS && VibrationIOS.vibrate()
  }

  componentDidMount() {
    Animated.timing(this.state.pan, {
      toValue: 0,
      easing: Easing.in(Easing.exp),
      duration: 300,
    }).start((fin) => {
      this.initializePanResponder();
      this.setState({inPlace: true});
      this.setNotificationGoAwayTimer();
    })
  }
  componentWillReceiveProps(nProps){
    if(!nProps.notification.visible && this.props.notification.visible || nProps.notification != this.props.notification){
      // console.log('kill notification?');
      // this.killNotification()

    }
  }

  setNotificationGoAwayTimer(delay = 5000){
    this._timer = this.setTimeout(() => {
      this.hideNoti();
    }, delay);
  }

  hideNoti(){
    Animated.timing(this.state.pan, {
      toValue: -220,
      easing: Easing.in(Easing.exp),
      duration: 300,
    }).start((fin) => {
      this.killNotification()
    })
  }

  componentWillUnmount(){
    this.killTimer()
  }

  freezeNotification(){
    this.killTimer()
  }

  killTimer(){
    if(this._timer){
      this.clearTimeout(this.timer);
      delete this._timer;
    }
  }

  initializePanResponder(){
    delete this._panResponder
    const freezeNotification = this.freezeNotification.bind(this);

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        return true
      },
      onPanResponderStart: (e, gestureState) => {
        freezeNotification();
      },
      onPanResponderMove: Animated.event([null, {
        dy: this.state.pan.y,
        dx: this.state.pan.x
      }]),
      onPanResponderRelease: (e, gestureState) => {
        const {dx, dy, vx, vy} = gestureState;

        const toValue = vy > 0 && dy > vy / 3 ? 0 : -200;
        Animated.timing(this.state.pan.y, {
          toValue,
          easing: Easing.out(Easing.exp),
          duration: 150,
        })
        .start(fin => {
          if(toValue <= 0){
            this.props.dispatch({type: 'DISMISS_ALL_NOTIFICATIONS', payload: {}})
          }
        })
      }
    })
  }
  tapNotification(e){
    Animated.timing(this.state.pan, {
      toValue: {x: 0, y: -220},
      duration: 300,
    }).start(() => {
      this.tapped()
    })

    // NotificationActions.updateBadgeNumber.defer(-1)
  }
  tapped(){
    const {notification} = this.props;
    const noti = (notification.label || notification.type || '').toLowerCase();
    if((noti.indexOf('match') > -1 || noti.indexOf('message') > -1)){
    //   if(this.props.chatOpen){
    //     // if(this.props.chatOpen == notification.match_id){
    //     //   __DEV__ && console.log('chat already open')
    //     // }else{

    //     //   this.props.pushChat({...notification, ...notification.data, fromNotification:true});
    //     // }

    //   }else{

      this.props.pushChat({...notification, ...notification.data, fromNotification: true});
      // }
    }
    this.props.dispatch({type: 'DISMISS_ALL_NOTIFICATIONS', payload: {}})
  }
  killNotification(){
    Animated.timing(this.state.pan, {
      toValue: {x: 0, y: -220},
      duration: 300,
    }).start(() => {
      this.props.dispatch({type: 'DISMISS_NOTIFICATION', payload: {}})
      // this.props.dispatch({type:'DISMISS_ALL_NOTIFICATIONS',payload:{}})
    })
  }

  render(){
    if(!this.props.notification) return false;

    const {notification} = this.props;
    const noti = (notification.label || notification.type || '').toLowerCase();

    if((noti.indexOf('match') > -1 || noti.indexOf('message') > -1)){
      if(this.props.chatOpen){
        if(this.props.chatOpen == notification.match_id){
          __DEV__ && console.log('chat already open')
          this.props.dispatch({type: 'DISMISS_ALL_NOTIFICATIONS', payload: {}})
          return false
        }
      }
    }

    const { user } = this.props;
    let theirIds;
    let them;
    let threadName;
    let matchName;
    var u = notification.users || '{}';
    const users = JSON.parse(u);
    let from_user_info
    let image_url
    let fromuser = notification.from_user_info || "{}";

    if(noti.indexOf('match') > -1){
      myPartnerId = user.partner_id || null;
      theirIds = Object.keys(users).filter(u => u != user.id && u != user.partner_id);
      them = theirIds.map((id) => users[id]);

      threadName = them.map(u => u.firstname).join(' & ');
      matchName = threadName + (theirIds.length > 1 ? ' like ' : ' likes ');

      image_url = users[notification.closer_id].image_url;

    }else if(noti.indexOf('message') > -1){
      from_user_info = JSON.parse(fromuser) || {};
      image_url = from_user_info.image_url;

    }


    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[styles.notificationWrapper,
          {
            height: this.state.inPlace ? this.state.pan.y.interpolate({
              inputRange: [0, DeviceHeight / 2, DeviceHeight],
              outputRange: [NOTI_HEIGHT, DeviceHeight / 4, DeviceHeight / 4],
              extrapolate: 'clamp'
            }) : NOTI_HEIGHT,
            transform: [{
              translateY: this.state.inPlace ? this.state.pan.y.interpolate({
                inputRange: [-NOTI_HEIGHT, 0, DeviceHeight],
                outputRange: [-NOTI_HEIGHT, 0, 10]
              }) : this.state.yValue
            }],
            justifyContent: 'flex-end'
          },
        styles[noti]
        ]}
      >
      {iOS &&  <StatusBar animated barStyle="light-content" hidden />}

        {noti.indexOf('message') > -1 ?
          <View style={[styles.notificationOverlay, styles.newmessage]}>
            <TouchableOpacity onPress={this.tapNotification.bind(this)}>
              <View style={styles.notificationInside}>
                <View style={styles.notificationLeft}>
                  <Image
                    resizeMode={Image.resizeMode.cover}
                    style={styles.notiImage}
                    defaultSource={require('../../assets/placeholderUserWhite@3x.png')}
                    source={{uri: image_url}}
                  />
                </View>
                <View style={styles.notificationRight}>
                  <Text style={[styles.notiTitle, styles.titleNewMessage]}>{
                    (from_user_info.name || from_user_info.firstname || '').toUpperCase()
                  }</Text>
                  <View style={{flexWrap: 'wrap'}}>
                      <Text style={styles.notiText} ellipsizeMode={'tail'} numberOfLines={2}>{ notification.message_body}</Text>
                  </View>
                </View>
              </View>

            </TouchableOpacity>
            <View style={{position: 'absolute', right: 3, top: 3, zIndex: 99}}>
              <TinyClose
                size={14}
                background={colors.white20}
                killNotification={this.killNotification.bind(this)}
                notification={notification}
                buttonUnderlay={colors.mediumPurple}
              />
            </View>
          </View> : null
        }

        {noti.indexOf('match') > -1 ?
          <View style={[styles.notificationOverlay, styles.match]}>
            <TouchableOpacity onPress={this.tapNotification.bind(this)}>
              <View style={styles.notificationInside}>
                <View style={styles.notificationLeft}>
                  <Image
                    resizeMode={Image.resizeMode.cover}
                    style={[styles.notiImage]}
                    defaultSource={require('../../assets/placeholderUserWhite@3x.png')}
                    source={{uri: image_url}}
                  />
                </View>
                <View style={styles.notificationRight}>
                  <Text style={[styles.notiTitle, styles.titleNewMatch]}>{`IT'S A MATCH!`}</Text>
                  <Text style={styles.notiText}>{`${matchName.length > 0 ? matchName : 'This user likes'} you back!`}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{position: 'absolute', right: 3, top: 3, zIndex: 99}}>
              <TinyClose
                size={14}
                background={colors.white20}
                killNotification={this.killNotification.bind(this)}
                notification={notification}
                buttonUnderlay={colors.mediumPurple}
              />
            </View>
          </View> : null
        }


        {noti == 'display' ?
          <TouchableHighlight style={[styles.notificationOverlay, styles.message]} onPress={this.tapNotification.bind(this)}>

            <View style={styles.notificationInside}>

              {image_url && (
              <View style={styles.notificationLeft}>
                <Image
                  resizeMode={Image.resizeMode.cover}
                  style={styles.notiImage}
                  source={{uri: image_url}}
                />
              </View>
              )}

              <View style={styles.notificationRight}>

                <Text
                  style={[styles.notiTitle, styles.titleNewMessage]}
                >{
                  notification.title
                }</Text>

                <Text
                  style={styles.notiText}
                  numberOfLines={2}
                >{
                  notification.body
                }</Text>

              </View>

              <View style={{position: 'absolute', right: 5, top: 5}}>
                <TinyClose
                  background={colors.mediumPurple}
                  size={20}
                  killNotification={this.killNotification.bind(this)}
                  notification={notification}
                  buttonUnderlay={colors.mediumPurple}
                />
              </View>
            </View>
          </TouchableHighlight>
        : null }

      </Animated.View>
    )
  }
}

export default Notification

const TinyClose = props => {
  return (
    <TouchableHighlight
      style={[{alignItems: 'center', justifyContent: 'center', height: props.size, top: 0, width: props.size, backgroundColor: props.background, borderRadius: props.size / 2}]}
      onPress={props.killNotification}
      underlayColor={props.buttonUnderlay || colors.mediumPurple20}
    >
      <Image
        resizeMode={Image.resizeMode.contain}
        style={{width: props.size / 2, height: props.size / 2, zIndex: 1000, tintColor: props.xColor || colors.white}}
        source={require('../../assets/close@3x.png')}
      />
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  notificationWrapper: {
    width: DeviceWidth - 14,
    flex: 1,
    position: 'absolute',
    borderRadius: 8,
    top: 7,
    left: 7,
    right: 7,
    backgroundColor: colors.shuttleGray,
    height: 220,
    shadowColor: '#222',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  notificationOverlay: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between'
  },
  newmessage: {
    backgroundColor: colors.mediumPurple,

  },
  message: {
    backgroundColor: colors.mediumPurple,

  },
  match: {
    backgroundColor: colors.sushi,

  },
  newmatch: {
    backgroundColor: colors.sushi,

  },
  danger: {
    backgroundColor: colors.mandy,

  },
  display: {
    backgroundColor: colors.shuttleGray,

  },
  notificationLeft: {
    width: 60,

  },
  notificationRight: {
    // flex:1,
    width: DeviceWidth - 100,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 7
  },

  notiText: {
    color: colors.white,
    fontFamily: 'omnes',
    flexDirection: 'column',
    fontSize: 15
  },

  notiTitle: {
    fontFamily: 'montserrat',
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  titleNewMessage: {
    color: colors.white,
  },
  titleNewMatch: {
    color: colors.sashimi,
  },
  notificationInside: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'relative'
  },
  notiImage: {
    margin: 10,

    width: 50,
    height: 50,
    overflow: 'hidden',
    borderRadius: 25,
    borderWidth: 0,
    backgroundColor: colors.transparent
  }

})
