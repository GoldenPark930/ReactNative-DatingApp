
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  LayoutAnimation,
  Dimensions,
  Modal, ScrollView
} from 'react-native';
import React, { Component } from 'react';

import UserProfile from '../UserProfile';

import {withNavigation} from '@exponent/ex-navigation';
import Router from '../../Router'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../../utils/colors'
import FadeInContainer from '../FadeInContainer'
import ReportModal from './ReportModal'
import BlurModal from './BlurModal'
import UnmatchModal from './UnmatchModal'
import ActionMan from '../../actions'
import { BlurView, VibrancyView} from 'react-native-blur'

class Action extends React.Component{

  render(){

    const {user} = this.props;
    const currentMatch = this.props.match || this.props.currentMatch || this.props.matchInfo || this.props.route && this.props.route.params.matchInfo || {};

    const img_url_id = Object.keys(currentMatch.users).filter(uid => uid != this.props.user.id && uid != this.props.user.partner_id);

    if(typeof img_url_id == 'object'){
      img_url_id_id = img_url_id[0]
    }
    const img_url = currentMatch.users[(img_url_id_id || img_url_id) ].image_url;

    const theirIds = Object.keys(currentMatch.users).filter(u => u != this.props.user.id && u != this.props.user.partner_id)
    const them = theirIds.map(id => currentMatch.users[id])
    let matchName;
    if(this.props.user.relationship_status == 'couple'){
      matchName = them[0].firstname
    }else{
      matchName = `${them.reduce((acc, u, i) => { return acc + u.firstname.toUpperCase() + (i == 0 ? ' & ' : '') }, '')}`;
    }

    return (

      <BlurModal>

        <View style={[styles.actionmodal]}>
          {/* <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => { this.props.dispatch(ActionMan.killModal()) }}
            style={[{
              position: 'absolute', top: 30,zIndex:9999, left: 10, backgroundColor: 'transparent'}]}
          >
            <Text>x</Text>
          </TouchableOpacity> */}
          <View style={[styles.insideactionmodal]}>
            <View style={{flexDirection: 'column', justifyContent: 'space-around', flex: 1}}>

              <View style={[styles.userimageContainer, styles.blur]}>
                <Image
                  style={styles.userimage}
                  key={currentMatch.match_id}
                  source={{uri: img_url}}
                  defaultSource={require('./assets/placeholderUser@3x.png')}
                  resizeMode={Image.resizeMode.cover}
                />
                <Text style={{color: colors.white, fontFamily: 'montserrat', fontWeight: '800', fontSize: 18}}>
                  {matchName}
                </Text>

              </View>

              <View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                  paddingHorizontal: 0,
                  paddingBottom: 10,
                  marginBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.shuttleGray
                }}
                >

                  <TouchableHighlight
                    style={[styles.clearButton, styles.inlineButtons, {marginRight: 10}]}
                    underlayColor={colors.shuttleGray20}
                    onPress={() => {
                      this.props.dispatch(ActionMan.killModal())

                      this.props.dispatch(ActionMan.showInModal({component: 'UnmatchModal', passProps: {match: currentMatch, goBack: () => { this.props.dispatch(ActionMan.killModal()) } }}))


                    }}
                  >
                    <View >
                      <Text style={[styles.clearButtonText]}>UNMATCH</Text>
                    </View>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[styles.clearButton, styles.inlineButtons, {marginLeft: 10}]}
                    underlayColor={colors.shuttleGray20}
                    onPress={() => {
                      this.props.dispatch(ActionMan.showInModal({component: 'ReportModal', passProps: {match: currentMatch, }}))
                    }}
                  >
                    <View>
                      <Text style={[styles.clearButtonText]}>REPORT</Text>
                    </View>
                  </TouchableHighlight>

                </View>


                <TouchableHighlight
                  style={[styles.clearButton, styles.modalButton, {borderColor: colors.mediumPurple, backgroundColor: colors.mediumPurple20}]}
                  underlayColor={colors.mediumPurple}
                  onPress={() => {
                    const theirIds = Object.keys(currentMatch.users).filter(u => { return u != user.id && u != user.partner_id })
                    const them = theirIds.map((id) => currentMatch.users[id])

                    const MatchUserAsPotential = {
                      user: them[0],
                      partner: them[1] || {},
                      couple: {}
                    }
                    this.props.dispatch(ActionMan.killModal())
                    this.props.dispatch(ActionMan.pushRoute('UserProfile', { potential: MatchUserAsPotential, user: this.props.user}));
                  }}
                >
                  <View >
                    <Text style={[styles.clearButtonText, styles.modalButtonText]}>
                      VIEW PROFILE
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>

            <TouchableOpacity onPress={() => { this.props.dispatch(ActionMan.killModal()) }}>
              <View style={{flexGrow: 1, width: DeviceWidth-20,height:30,alignItems:'center',justifyContent:'center',backgroundColor:'transparent'}}>
                <Text style={{textAlign: 'center', fontSize: 16, color: colors.white,fontFamily:'omnes'}}>CANCEL</Text>
              </View>
            </TouchableOpacity>
          </View>

          </View>
        </View>

      </BlurModal>


)
  }

}

export default Action


const styles = StyleSheet.create({
  actionmodal: {
    width: DeviceWidth,
    backgroundColor: 'transparent',
    height: DeviceHeight,
    justifyContent: 'flex-start',
    margin: 0,
    position: 'absolute',
    bottom: 0,
    top: 0,
    overflow: 'hidden',
    flexGrow: 1,

  },
  insideactionmodal: {
    // backgroundColor: colors.outerSpace,
    padding: 10,
    bottom: 0,
    position: 'absolute',
    flex: 1,
    width: DeviceWidth,
    justifyContent: 'space-between',

    height: DeviceHeight,

  },
  clearButton: {
    backgroundColor: 'transparent',
    borderColor: colors.rollingStone,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 0,
    justifyContent: 'center',
    height: 60,
    borderWidth: 1

  },
  modalButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    margin: 10,
    borderRadius: 0,
    justifyContent: 'center',
    height: 60,
    borderWidth: 1
  },
  profileButton: {
    backgroundColor: colors.mediumPurple20,
    borderColor: colors.mediumPurple,

  },
  inlineButtons: {
    flex: 1,
  },
  modalButtonText: {
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 18,

    textAlign: 'center'
  },
  clearButtonText: {
    color: colors.rollingStone,
    fontFamily: 'montserrat',
    fontSize: 18,

    textAlign: 'center'
  },

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexDirection: 'column',
    width: DeviceWidth,
    height: DeviceHeight,
    top: 0,
    position: 'absolute'


  },
  fullwidth: {
    width: DeviceWidth
  },
  col: {
    flexDirection: 'column',
    padding: 0,
  },


  userimageContainer: {

    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingTop: 0,
    marginVertical: 10,
    paddingBottom: 20,
    width: DeviceWidth - 20,
    paddingHorizontal: 20,
  },

  blur: {

  },

  userimage: {
    padding: 0,
    marginVertical: 10,
    height: 150,
    marginBottom: 20,
    width: 150,
    position: 'relative',
    borderRadius: 75,
    overflow: 'hidden'
  },
})


const animations = {
  layout: {
    spring: {
      duration: 500,
      create: {
        duration: 300,
        delay: 500,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        delay: 500,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};
