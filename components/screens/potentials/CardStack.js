import React from 'react';
import { StatusBar, View, Easing, LayoutAnimation, Image, Animated, PanResponder, Dimensions, InteractionManager, Platform } from 'react-native';
import { NavigationActions } from '@exponent/ex-navigation'
import {pure, onlyUpdateForKeys} from 'recompose'
import Analytics from '../../../utils/Analytics';
import Card from './NewerCard';
import styles from './styles';
import ActionMan from '../../../actions/';
import ApproveIcon from './ApproveIcon'
import DenyIcon from './DenyIcon'
import Router from '../../../Router'
import TimerMixin from 'react-timer-mixin';
import Toolbar from './Toolbar'
import CustomLayoutAnimations from './LayoutAnimations'
import reactMixin from 'react-mixin'


const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const iOS = Platform.OS == 'ios';

const THROW_THRESHOLD_DENY = -1 * (10);
const THROW_THRESHOLD_APPROVE = 15;
const THROW_SPEED_THRESHOLD = 1;

const SWIPE_THRESHOLD_DENY = -100;
const SWIPE_THRESHOLD_APPROVE = 100;

const TAP_UP_TIME_THRESHOLD = 300


@reactMixin.decorate(TimerMixin)
class CardStack extends React.Component {

  static displayName = 'CardStack';

  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
      animatedIn: true,
      one: new Animated.Value(1),
      likedPotentials: [],
      cardopen: new Animated.Value(0.92),
      heightBox: new Animated.Value(DeviceHeight - 60),

    };
  }


  componentDidMount() {
    this.initializePanResponder();
    this.state.cardopen.setValue(0.92);
  }

  componentWillReceiveProps(nProps) {
    const n = nProps;
    const p = this.props;

    if(n.profileVisible != p.profileVisible){

      LayoutAnimation.configureNext(CustomLayoutAnimations.layout.spring)

      Animated.timing(this.state.cardopen, {
        toValue: n.profileVisible ? 1.00 : 0.92,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        this.state.pan.setValue({ x: 0, y: 0 });

      });
    }
  }

  componentDidUpdate(pProps, pState){
    if(this.props.potentials[0] && pProps.potentials[0]){

      const pid = this.props.potentials[0].user.id
      const nid = pProps.potentials[0].user.id
      if(nid != pid){
        // this.setTimeout(() => {
          this.state.pan.setValue({ x: 0, y: 0 });

          this.state.cardopen.setValue(0.92);

      // }, 10)

      }else{
        this.state.pan.setValue({ x: 0, y: 0 });
      }
    }else if(!iOS && this.props.drawerOpen != pProps.drawerOpen){
      this.state.cardopen.setValue(0.92);
    }
  }


  initializePanResponder() {
    let timeoutId;

    this._panResponder = PanResponder.create({

      onMoveShouldSetPanResponderCapture: (e, gestureState) => {

        return !this.props.profileVisible
      },

      onMoveShouldSetPanResponder: (e, gestureState) => {

        if(timeoutId) {this.clearTimeout(timeoutId);}

        return !this.props.profileVisible // && gestureState.dx > 0

      },
      //
      onStartShouldSetPanResponder: (e, gestureState) => (!this.props.profileVisible),
      //
      onStartShouldSetPanResponderCapture: (e, gestureState) => {
        const likeUserId = this.props.potentials[0].user.id;
        timeoutId = this.setTimeout(() => {
        //
          if(!this.props.profileVisible && Math.abs(gestureState.dx) < 3 && Math.abs(gestureState.dy) < 3 && this.props.potentials[0].user.id == likeUserId) this._toggleProfile();

        }, TAP_UP_TIME_THRESHOLD);
        //
        return !this.props.profileVisible // && gestureState.dx != 0
      },
      onPanResponderTerminationRequest: (evt, gestureState) => {
        return false
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled

      },

      //
      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y,
        useNativeDriver: true
      }]),

      onShouldBlockNativeResponder: (e, gestureState) => false,

      onPanResponderRelease: (e, gestureState) => {
        let toValue = {x: 0, y: 0};
        let velocity = 1;
        let likeStatus;
        //console.log('release');
        const { dx, dy, vx, vy } = gestureState;

        const likeUserId = this.props.potentials[0].user.id;

        if(Math.abs(dx) >= 1 || Math.abs(dy) >= 1){
          this.clearTimeout(timeoutId);

        }
              // animate back to center or off screen left or off screen right
        if(dx > SWIPE_THRESHOLD_APPROVE || (dx > (THROW_THRESHOLD_APPROVE - 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD)) {
          //__DEV__ && console.log(dx > SWIPE_THRESHOLD_APPROVE ? 'SWIPE' : (dx > (THROW_THRESHOLD_APPROVE - 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD) && 'THROW');

          toValue = { x: DeviceWidth + 10, y: dy };
          velocity = { x: parseInt(vx), y: parseInt(vy) };
          likeStatus = 'approve';

          // if(!this.state.likedPotentials.indexOf(likeUserId)) {
          //   likeStatus = null;
          // }
        }else if(dx < SWIPE_THRESHOLD_DENY || (dx < (THROW_THRESHOLD_DENY + 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD)) {
          toValue = { x: -DeviceWidth - 10, y: dy };
          velocity = { x: vx, y: vy };
          likeStatus = 'deny';
        }

        if(likeStatus){

          const relstatus = this.props.rel === 'single' ? 'couple' : 'single';
          const otherParams = { relevantUser: this.props.potentials[0] };


          Animated.timing(this.state.pan, {
            toValue,
            duration: 50,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true

            // deceleration: 1.2,
          }).start(() => {
            this.props.dispatch(ActionMan.SwipeCard({
              likeUserId, likeStatus, relstatus, rel: this.props.rel, ...otherParams
            }));


          });

        }else{

          setImmediate(() => {
            Animated.spring(this.state.pan, {
              toValue,
              velocity: { x: (vx) * 2, y: (vy) * 2 },
              tension: 20,
              friction: 5,
              useNativeDriver: true

            }).start(() => {

            });
          })
        }
      },
    });
  }

  _showProfile(potential) {
    Analytics.event('Interaction', { type: 'tap', name: 'Open card profile', potential });
    this.props.dispatch({type: 'OPEN_PROFILE', payload: {}});
  }

  _hideProfile() {
    this.props.toggleProfile();
  }

  _toggleProfile() {
    this.props.profileVisible
      ? this.props.dispatch({ type: 'CLOSE_PROFILE' })
      : this.props.dispatch({ type: 'OPEN_PROFILE' });
  }


  render() {
    const { potentials, user } = this.props;
    if(!this._panResponder){
      this.initializePanResponder();
    }
    const { pan } = this.props;

    const {_panResponder} = this
    const potential = potentials[0] || { user: {} };
    const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : null];

    if(potential.partner && potential.partner.id && potential.partner.firstname) {
      names.push(potential.partner.firstname.trim());
    }

    let matchName = `${names[0]} (${potential.user.age})`;
    let distance = potential.user.distance || 0;
    const city = potential.user.city_state || '';
    const partnerDistance = potential.partner ? potential.partner.distance : 0;
    if(potential.partner && potential.partner.firstname) {
      matchName = `${matchName} ${potential.partner.firstname == '+1' ? '' : '&'} ${names[1]}${potential.partner.firstname == '+1' ? '' : ` (${potential.partner.age})`}`;
      distance = Math.min(distance, partnerDistance || 0);
    }
    let nextnames
    let nextcity
    let nextpartnerDistance
    let nextmatchName
    let nextdistance

    const nextPotential = potentials[1] || null;
    if(nextPotential && nextPotential.user){
      nextnames = [nextPotential.user && nextPotential.user.firstname ? nextPotential.user.firstname.trim() : null];
      if(nextPotential.partner && nextPotential.partner.id && nextPotential.partner.firstname) {
        nextnames.push(nextPotential.partner.firstname.trim());
      }

      nextmatchName = `${nextnames[0]} (${nextPotential.user.age})`;
      nextdistance = nextPotential.user.distance || 0;
      nextcity = nextPotential.user.city_state || '';
      nextpartnerDistance = nextPotential.partner ? nextPotential.partner.distance : 0;
      if(nextPotential.partner && nextPotential.partner.firstname) {
        nextmatchName = `${nextmatchName} ${nextPotential.partner.firstname == '+1' ? '' : '&'} ${nextnames[1]}${nextPotential.partner.firstname == '+1' ? '' : ` (${nextPotential.partner.age})`}`;

        nextdistance = Math.min(nextdistance, nextpartnerDistance || 0);
      }
    }


    const cardHeight = DeviceHeight - (iOS ? 60 : 40);
    const cardWidth = DeviceWidth;

    return (
      <View
        pointerEvents={'box-none'}
        style={{
          flexGrow: 1,
          alignSelf: 'stretch',
          alignItems: 'center',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999999,
          position: 'absolute',
          overflow: 'visible',
          backgroundColor: this.props.profileVisible ? '#000' : 'transparent'
        }}
      >

        {/* <Toolbar dispatch={this.props.dispatch} key={'tb'}/> */}

        { nextPotential && !this.props.profileVisible &&
          <Animated.View
            style={[{
              alignSelf: 'center',
              borderRadius: 11,
              width: DeviceWidth,
              overflow: 'visible',
              backfaceVisibility: 'hidden',
              height: iOS ? (this.props.profileVisible ? DeviceHeight : DeviceHeight - 60) : this.props.profileVisible ? DeviceHeight : DeviceHeight-40,
              top: 0, // iOS ? this.props.profileVisible ? 0 : 0 :  this.props.profileVisible ? 0 : 0,
              position: 'absolute',
              flexGrow: 1,
              opacity: this.state.pan.x.interpolate({
                inputRange: [-DeviceWidth, -DeviceWidth + 40, -DeviceWidth / 2, 0, DeviceWidth / 2, DeviceWidth - 40, DeviceWidth],
                outputRange: [1, 0.8, 0.1, 0.0, 0.1, 0.8, 1],
              }),
              top: iOS ? (60) : this.props.profileVisible ? -40 : 40, // iOS ? this.props.profileVisible ? 0 : 0 :  this.props.profileVisible ? 0 : 0,
              transform: [
              {
                  scale: this.state.cardopen
              },
              ],

            }]}
            key={`${nextPotential.user.id}-wrapper`}
            pointerEvents={'none'}

          >
            <Card
              user={user}
              navigator={this.props.navigator}
              key={`${nextPotential.id || nextPotential.user.id}-activecard`}
              rel={user.relationship_status}
              isTopCard={false}
              pan={this.state.pan}
              city={nextcity}
              profileVisible={this.props.profileVisible}
              hideProfile={this._hideProfile.bind(this)}
              toggleProfile={this._toggleProfile.bind(this)}
              showProfile={this._showProfile.bind(this)}
              potential={nextPotential}
              reportModal={() => {}}
              matchName={nextmatchName}
              cardWidth={this.props.profileVisible ? DeviceWidth : cardWidth}
              cardHeight={cardHeight}
              dispatch={this.props.dispatch}
            />
          </Animated.View>
        }

        { potential &&
          <Animated.View

            style={[{
              alignSelf: 'center',
              borderRadius: 11,
              width: DeviceWidth,
              height: this.props.profileVisible ? DeviceHeight : (iOS ? DeviceHeight - 60 : DeviceHeight-40),
              top: this.props.profileVisible ? (iOS ? 60 : 0) : (iOS ? 60 : 40),
              position: 'absolute',
              flexGrow: 1,

              transform: !this.props.profileVisible ? [
              {
                  translateX: this.state.pan.x,
              },
              {
                  translateY: this.state.pan.y
              },
              {
                  scale: this.state.cardopen
              },
              ] : [],
            }]}
            key={`${potentials[0].user.id}-wrapper`}
            {...(_panResponder.panHandlers)}
          >
            <Card
              user={user}
              navigator={this.props.navigator}
              key={`${potentials[0].id || potentials[0].user.id}-activecard`}
              rel={user.relationship_status}
              isTopCard
              pan={this.state.pan}
              city={city}
              cardWidth={this.props.profileVisible ? DeviceWidth : cardWidth}
              cardHeight={this.props.profileVisible ? DeviceHeight : cardHeight}
              matchName={matchName}
              profileVisible={this.props.profileVisible}
              closeProfile={this._hideProfile.bind(this)}
              hideProfile={this._hideProfile.bind(this)}
              toggleProfile={this._toggleProfile.bind(this)}
              showProfile={this._showProfile.bind(this)}
              potential={potentials[0]}
              dispatch={this.props.dispatch}
            />
          </Animated.View>
        }
      </View>
    );
  }
}

export default CardStack;
