import React, { Component } from 'react';
import { Text, View, Dimensions} from 'react-native';
import { createRouter, NavigationProvider, StackNavigation} from '@exponent/ex-navigation'
import colors from '../utils/colors'
import OnboardModal from './modals/OnboardModal'
import LocationPermissions from './modals/LocationPermissions'
import NotificationsPermissions from './modals/NotificationsPermissions'
import Coupling from './screens/coupling'
import JoinCouple from './screens/coupling/JoinCouple'
import EnterCouplePin from './screens/coupling/EnterCouplePin'
import CouplePin from './screens/coupling/CouplePin'
import NoPartner from './screens/coupling/NoPartner'
import CoupleReady from './screens/coupling/CoupleReady';
import CoupleSuccess from './screens/coupling/CoupleSuccess';
import FBAlbumView from './FBAlbumView'
import FBPhotoAlbums from './FBPhotoAlbums'
import FacebookImageSource from './screens/FacebookImageSource'

import {connect} from 'react-redux'
import FadeInContainer from './FadeInContainer';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const Finish = () => (
  <View><Text>Finish</Text></View>
)

export const OnboardRouter = createRouter(() => ({
  OnboardModal: () => OnboardModal,
  LocationPermissions: () => LocationPermissions,
  NotificationsPermissions: () => NotificationsPermissions,
  Coupling: () => Coupling,
  JoinCouple: () => JoinCouple,
  EnterCouplePin: () => EnterCouplePin,
  CouplePin: () => CouplePin,
  CoupleSuccess: () => CoupleSuccess,
  CoupleReady: () => CoupleReady,
  NoPartner: () => NoPartner,
  finish: () => Finish,
  FacebookImageSource: () => FacebookImageSource,
  FBPhotoAlbums: () => FBPhotoAlbums,
  FBAlbumView: () => FBAlbumView,

}));

const Onboard = (props) => {
  let initialRoute;
  const notificationPermission = props.permissions.notifications && props.permissions.notifications != 'undetermined';
  const locationPermission = props.permissions.location && props.permissions.location != 'undetermined';
  if(!props.user.relationship_status){
    initialRoute = 'OnboardModal'
  }else if(props.user.relationship_status){

    if(props.user.relationship_status == 'single'){
      if(!locationPermission){
        initialRoute = 'LocationPermissions'
      }else if(!notificationPermission){
        initialRoute = 'NotificationsPermissions'
      }else{
        initialRoute = 'finish'
      }
    }else if(props.user.relationship_status == 'couple'){
      if(props.user.partner_id){
        if(!locationPermission){
          initialRoute = 'LocationPermissions'
        }else if(!notificationPermission){
          initialRoute = 'NotificationsPermissions'
        }else{
          initialRoute = 'OnboardModal'
        }
      }else{
        initialRoute = 'JoinCouple'
      }
    }


  }
  return (
    <View style={{width:DeviceWidth,height:DeviceHeight,}}>

        <StackNavigation
          id="onboardnavigation"
          defaultRouteConfig={{
            navigationBar: {
              visible: false,
              title: 'ok',
              titleStyle: {
                color: colors.white,
                fontFamily: 'montserrat',
                borderBottomWidth: 0,
              }
            },
          }}
          initialRoute={initialRoute}
        />
    </View>
  );
}
export default Onboard


//
// const mapStateToProps = (state, ownProps) => {
//
//   return {
//     ...ownProps,
//     user: state.user,
//     permissions: state.permissions,
//   }
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return { dispatch };
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)((Onboard));
