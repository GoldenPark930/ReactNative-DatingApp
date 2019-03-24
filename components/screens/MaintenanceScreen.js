import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import Analytics from '../../utils/Analytics';
import colors from '../../utils/colors';
import config from '../../../config';
import DeviceInfo from '../../utils/DeviceInfo';
import { logOut } from '../../actions/appActions';

const { SERVER_URL } = config;
const Device = DeviceInfo.get();
const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;
const MAX_ATTEMPS_BEFORE_LOGOUT = 10;
const VERSION = Device.app_version;
const iOSversion = Device.version;


class MaintenanceScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      attempts: 0,
      buttonOpacity: new Animated.Value(0),
      lastAttempt: null,
      mountedAt: Date.now()
    }
  }

  componentDidMount() {
    __DEV__ && console.log(this.props);

    Animated.timing(
      this.state.buttonOpacity,
      {
        toValue: 1.0,
        delay: 2000,
        duration: 1000
      }
    ).start(() => {

    });
  }

  async healthCheck() {
    return fetch(`${SERVER_URL}/user/info`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-T3P-Api-Version': `2/${VERSION}/${iOSversion}`,
        'Accept-Language': Device.locale
      },
      body: JSON.stringify({
        healthCheck: true,
        ...this.props.creds
      })
    })
    .then(res => {
      const resjson = res.json();
      __DEV__ && console.log(resjson);
      return resjson;
    })
    .then(response => response)
  }

  tryAgain() {
    if (!this.state.attempting) {
      if (this.state.attempts > MAX_ATTEMPS_BEFORE_LOGOUT || !this.props.auth || !this.props.auth.user_id || !this.props.auth.api_key) {
        this.props.dispatch(logOut());
        this.props.kill();
        return;
      }
      this.setState({
        attempting: true,
      });
      Animated.timing(
        this.state.buttonOpacity,
        {
          delay: 0,
          duration: 1000,
          toValue: 0.0
        }
      ).start(() => {
        if(!this.state.lastAttempt || this.state.lastAttempt + 30000 > Date.now()) {
          this.healthCheck()
            .then(result => {
              __DEV__ && console.log(result);
              if (result) {
                this.props.kill();
              } else {
                this.atteptFailed();
              }
            }).catch(err => {
              __DEV__ && console.log(err, 'failed');
              this.attemptFailed();
            })
        }
      });
    }
  }

  attemptFailed() {
    if (!this.props.auth || !this.props.auth.user_id || !this.props.auth.api_key) {
      this.props.dispatch(logOut());
      this.props.kill();
      return;
    }

    Animated.timing(
      this.state.buttonOpacity,
      {
        toValue: 0.0,
        delay: 3000,
        duration: 2000
      }
    ).start(() => {

    });
  
    this.setState({
      attempting: false,
      attempts: this.state.attempts + 1,
      lastAttempt: Date.now(),
    });
  }

  handleFeedback() {

  }

  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.dusk,
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          left: 0,
          top: 0,
          position: 'absolute',
          width: DeviceWidth,
          height: DeviceHeight
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            maxHeight: 200
          }}
        >
          <Text style={{fontSize: 100}}>🔥</Text>
        </View>
        <Text
          style={{
            color: colors.white,
            fontFamily: 'montserrat',
            fontSize: 24,
            fontWeight: '700',
            marginTop: 20,
            textAlign: 'center'
          }}
        >
          SYSTEM MAINTENACE
        </Text>
        <Text
          style={{
            color: colors.white,
            fontFamily: 'omnes',
            fontSize: 20,
            fontWeight: '400',
            marginTop: 15,
            textAlign: 'center'
          }}
        >
          We're working on it. BRB!
        </Text>

        <View style={{position: 'relative', alignSelf: 'stretch', flexGrow: 1}}>
          <Animated.View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              left: 0,
              right: 0,
              top: 0,
              opacity: this.state.buttonOpacity,
              position: 'absolute',
              height: 180,
            }}
          >
            <TouchableOpacity
              onPress={() => this.tryAgain()}
              style={{
                alignSelf: 'center',
                borderColor: colors.white,
                borderWidth: 1,
                borderRadius: 5,
                marginVertical: 30,
                paddingVertical: 13,
                width: 150,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 14,
                  fontFamily: 'montserrat',
                  fontWeight: '700',
                  textAlign: 'center'
                }}
              >
                TRY AGAIN
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            pointerEvents={'none'}
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              left: 0,
              right: 0,
              top: 0,
              opacity: this.state.buttonOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              position: 'absolute',
              height: 180
            }}
          >
            <ActivityIndicator
              animating
              color={colors.white}
              size="large"
            />
          </Animated.View>
        </View>
      </View>
    )
  }
}

reactMixin(MaintenanceScreen.prototype, TimerMixin);
MaintenanceScreen.displayName = 'MaintenanceScreen';

const mapStateToProps = (state, p) => ({
  ...p,
  auth: state.auth
});
const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(MaintenanceScreen);
