import React, {Component} from 'react'
import {StyleSheet, BackHandler, Text, View, Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'
import {connect} from 'react-redux'
import {NavigationStyles, withNavigation} from '@exponent/ex-navigation'
import colors from '../../../utils/colors'
import Carousel from './carousel'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import FacebookButton from '../../buttons/FacebookButton/welcomeScreen';
import ActionMan from '../../../actions/'
import Loading from './Loading'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


@reactMixin.decorate(TimerMixin)
export class Welcome extends Component{
  static route = {
    styles: NavigationStyles.Fade,
    navigationBar: {
      visible: false,
      translucent: true,
      backgroundColor: colors.transparent,
      renderRight(route, props){
        return false
      },
      renderLeft(route, props){
        return false
      }
    },

    statusBar: {
      translucent: false,
      backgroundColor: colors.dark70,

    },
  };
  static displayName: 'Intro';

  constructor() {
    super()
    this.state = {isAnimating: false, busy: false}
  }

  componentDidMount() {
    this._BackHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackHandler)
  }

  componentWillReceiveProps(nProps){
    if(nProps.loggedIn && nProps.status != this.props.status){
      if(nProps.status == 'onboarded'){
        this.props.dispatch(ActionMan.resetRoute('Potentials'))
      }else{
        this.props.dispatch(ActionMan.resetRoute('Onboard'))
      }
    }
  }

  componentWillUnmount(){
    if(this._BackHandler){
      this._BackHandler.remove()
      // BackHandler.EventListener('hardwareBackPress', this.handleBackHandler)
    }
  }

  handleBackHandler(){
    this.props.navigator.pop();
    return true;
  }

  whyFacebookModal(){
    this.props.dispatch(ActionMan.showInModal({component: 'WhyFacebook', passProps: {} }))
  }


  login(){
    this.setState({busy: true})
    this.props.dispatch({type: 'LOADING_PENDING'})
    this.setTimeout(() => {
      this.setState({busy: false})
    }, 20000)

    this.props.dispatch(ActionMan.loginWithFacebook())
  }

  render(){
    return (
      <View style={[styles.container]}>
        <View style={{}}>
          <Carousel />
        </View>

        <View style={{ marginHorizontal: 20}}>
          <FacebookButton
            shouldAuthenticate
            buttonText={'LOG IN WITH FACEBOOK'}
            onPress={this.login.bind(this)}
            buttonStyles={{backgroundColor: colors.cornFlower, borderWidth: 0, height: 80}}
            outerButtonStyle={{height: 80, marginVertical: 10}}
            leftBoxStyles={{height: 80}}
            iconTintColor={'#fff'}
            busy={this.state.busy}
          />
        </View>
        <TouchableOpacity
          onPress={this.whyFacebookModal.bind(this)}
        >
          <View style={{ height: 50, alignSelf: 'center'}}>
            <Text
              style={{
                color: colors.rollingStone,
                fontFamily: 'omnes',
                fontSize: 12,
                textDecorationLine: 'underline'
              }}
            >Why Facebook?</Text>
          </View>
        </TouchableOpacity>
        {this.state.busy && <Loading />}

      </View>
    )
  }
}




const mapStateToProps = (state, p) => ({...p, loggedIn: state.auth.api_key && state.auth.user_id, status: state.user.status})
const mapDispatchToProps = (dispatch) => ({dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);


const styles = StyleSheet.create({


  container: {
    width: DeviceWidth,
    margin: 0,
    padding: 0,
    height: DeviceHeight,
    backgroundColor: colors.outerSpace,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    alignSelf: 'stretch',

  },
  textplain: {
    color: colors.white,
    alignSelf: 'center',
    fontSize: 22,
    fontFamily: 'omnes',
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: colors.white,
    alignSelf: 'center',
    fontFamily: 'montserrat'
  },
  carousel: {
    marginTop: 0,
    width: DeviceWidth,
    height: DeviceHeight - 200,

  },
  slide: {
    width: DeviceWidth,
    flexDirection: 'column',
    height: DeviceHeight - 150,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: MagicNumbers.screenPadding / 2
  },


  bottomarea: {
    height: 140,
    width: undefined,
    alignSelf: 'stretch',
    bottom: 100
  },
  textwrap: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  imagebg: {
    flex: 1,
    alignSelf: 'stretch',
    width: DeviceWidth,
    height: DeviceHeight,
    backgroundColor: colors.outerSpace
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  bottomButton: {
    height: 80,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  loginButton: {
    backgroundColor: colors.shuttleGray,
  },
  activeButton: {
    backgroundColor: colors.outerSpace,
  },
  registerButton: {
    backgroundColor: colors.mediumPurple,
  },
  wrap: {
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingBottom: 0
  },
  bottomButtons: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    //
    alignSelf: 'stretch',
    width: undefined,
    bottom: 40
  },
  // dot: {
  //   backgroundColor: colors.shuttleGray,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   marginLeft: 8,
  //   marginRight: 8,
  //   marginTop: 3,
  //   marginBottom: 3,
  //   borderColor: colors.shuttleGray
  // },
  // activeDot: {
  //   backgroundColor: colors.mediumPurple20,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   marginLeft: 8,
  //   marginRight: 8,
  //   marginTop: 3,
  //   marginBottom: 3,
  //   borderWidth: 2,
  //   borderColor: colors.mediumPurple
  // }
});
