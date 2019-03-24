import { View, Dimensions,Platform } from 'react-native';
import React, { Component } from 'react';

import {NavigationContext, createRouter, withNavigation, NavigationProvider, StackNavigation} from '@exponent/ex-navigation'
import colors from '../../../utils/colors';

import ActionMan from '../../../actions'
import CouplePin from './CouplePin';

import CoupleReady from './CoupleReady';

import CoupleSuccess from './CoupleSuccess';

import NoPartner from './NoPartner';

import EnterCouplePin from './EnterCouplePin';
import {connect} from 'react-redux'

import JoinCouple from './JoinCouple';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

const iOS = Platform.OS == 'ios';


const couplingRouter = createRouter(() => ({
  CouplePin: () => CouplePin,
  CoupleReady: () => CoupleReady,
  CoupleSuccess: () => CoupleSuccess,
  NoPartner: () => NoPartner,
  EnterCouplePin: () => EnterCouplePin,
  // JoinCouple: () => JoinCouple
}))

@withNavigation
class Coupling extends Component{

  static route = {
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      title(params){
        return ''
      }
    },
    statusBar: {
        translucent: false,
    },
  };

  constructor(props){
    super()

    this.state = { }
  }

  cancel(){
    this.props.close()
  }
  componentDidMount(){
    this.props.dispatch(ActionMan.getCouplePin());
  }

  render(){
    return (
      <View style={{height: DeviceHeight,flexGrow:1,
        top:0,position:'absolute',
        width: DeviceWidth,flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>

          <StackNavigation
            id="coupling"
            defaultRouteConfig={{
              sceneStyle: {
                backgroundColor:colors.outerSpace,
              },
              navigationBar: {
                visible: false,
              // borderBottomWidth: 0,
              // translucent: false,
              // tintColor: colors.white,
              // backgroundColor: 'rgba(0,0,0,0)',
              // titleStyle: {
              //   color: colors.white,
              //   fontFamily: 'montserrat',
              //   borderBottomWidth: 0,
              // }
              },
            }}
            initialRoute={couplingRouter.getRoute('CouplePin', {show: true})}
          />
      </View>
    )
  }

}


const mapStateToProps = (state, ownProps) => {

  return {
    ...ownProps,
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)((Coupling));
