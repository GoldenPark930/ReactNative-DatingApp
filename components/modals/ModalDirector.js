import { Dimensions, View, Modal, Platform } from 'react-native';
import React, {Component} from 'react';
import { withNavigation} from '@exponent/ex-navigation';
import { connect } from 'react-redux';
import Action from './Action'
import BlurModal from './BlurModal'
import NotificationsPermissions from './NotificationsPermissions'
import FieldModal from './FieldModal'
import LocationPermissions from './LocationPermissionsModal'
import OnboardModal from './OnboardModal'
import WhyFacebook from '../screens/welcome/WhyFacebook'
import Terms from '../screens/welcome/Terms'
import PrivacyPermissions from './PrivacyPermissions'
import ReportModal from './ReportModal'
import UnmatchModal from './UnmatchModal'
import colors from '../../utils/colors'
import Coupling from '../screens/coupling';
import ActionMan from '../../actions'
import CoupleReady from '../screens/coupling/CoupleReady'
import MaintenanceScreen from '../screens/MaintenanceScreen'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const Modals = {
  Action,
  BlurModal,
  WhyFacebook,
  Terms,
  FieldModal,
  LocationPermissions,
  MaintenanceScreen,
  OnboardModal,
  NotificationsPermissions,
  PrivacyPermissions,
  ReportModal,
  UnmatchModal,
  Coupling,
  CoupleReady
};


@withNavigation
class ModalDirector extends Component{
  constructor(props){
    super()
    this.state = {
      modalVisible: false,
      activeModal: props.activeModal
    }
  }

  componentWillReceiveProps(nProps){
    this.setState({
      activeModal: nProps.activeModal || {component: Action, passProps: nProps.actionModal},
      modalVisible: true
    })
  }
  shouldComponentUpdate(nProps, nState){
    return this.state.activeModal != nState.activeModal
  }
  setModalVisible(v){
    if(v){
      this.setState({modalVisible: v})
    }else{
      this.setState({
        modalVisible: false,
      })
      this.props.dispatch(ActionMan.killModal());
    }
  }
  render(){
    if(!this.state.activeModal){ return null }

    const { activeModal} = this.state;
    const ActiveModal = Modals[activeModal.component] || null;
    const ActiveModalProps = activeModal.passProps;

    return (

        ActiveModal ? (<Modal
          animationType={'slide'}
          transparent
          visible={this.state.modalVisible ? true : false}
          onRequestClose={this.setModalVisible.bind(this, false)}
        >
          {!iOS && <View
            style={{
              height: DeviceHeight,
              width: DeviceWidth,
              backgroundColor: colors.outerSpace,
              position: 'absolute'
            }}
          />}
          <ActiveModal
            {...ActiveModalProps}
            isModal={true}
            user={this.props.user}
            navigator={this.props.navigator}
            dispatch={this.props.dispatch}
            kill={() => this.props.dispatch(ActionMan.killModal())}
          />
        </Modal>
        ) : <View/>
    )
  }
}
// ///////////////// MODAL DIRECTOR
// /////////////////
ModalDirector.displayName = 'ModalDirector'

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  activeModal: state.ui.activeModal,
  user: state.user
})


const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalDirector);
//
//
// class OverlayModalInner extends Component{
//   setModalVisible(v){
//     this.props.setModalVisible(v);
//   }
//   render(){
//     return (
//       <Modal
//         animationType={'slide'}
//         transparent
//         visible={this.props.modalVisible ? true : false}
//         onRequestClose={this.props.setModalVisible}
//       >
//         {/* <Image source={{uri:this.props.imageUrl || ''}} resizeMode="cover" style={{height:DeviceHeight,width:DeviceWidth}}>*/}
//         {/* <VibrancyView blurType="dark" style={{height:DeviceHeight,width:DeviceWidth,position:'absolute'}} /> */}
//
//         {this.props.children}
//         {/* </Image>*/}
//
//       </Modal>
//     )
//   }
// }
