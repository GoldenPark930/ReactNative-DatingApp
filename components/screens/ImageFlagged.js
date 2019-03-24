
import React, {Component} from "react";
import {View, Dimensions, Navigator, Image, Text, TouchableOpacity} from "react-native";

import colors from '../../utils/colors'
import Analytics from '../../utils/Analytics'


import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import {MagicNumbers} from '../../utils/DeviceConfig'

const DeviceWidth = Dimensions.get('window').width;

import ContinueButton from '../controls/ContinueButton'

class ImageFlagged extends Component{

  static defaultProps = {
    user: {}
  };

  constructor(props){
    super();
    this.state = {
     }
  }
  componentDidMount(){
    Analytics.screen('ImageFlagged')
  }

  selectScene(route, navigator){
    const RouteComponent = route.component;

    return (
      <View style={{ flex: 1,  width: DeviceWidth, height: DeviceHeight,top:0}}>
        <RouteComponent
          navigator={navigator}
          route={route}
          {...route.passProps}
          user={this.props.user}
          AppState={this.props.AppState}
        />
      </View>
    );
  }
  render(){
    return (
      <Navigator
        ref={'nav'}
        initialRoute={{
          component: WarningScreen,
          index: 0,
          id: 'potentials'
        }}
        configureScene={route => route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FloatFromBottom}
        renderScene={this.selectScene.bind(this)}
        style={{position:'absolute',top:0, width: DeviceWidth, height: DeviceHeight,}}
      />
    )
  }
}


class WarningScreen extends Component{

  constructor(props){
    super();
    this.state = {
     }
  }
  handleContinue(){
    this.props.navigator.push({
      component: SelfImage
    });
  }
  render(){
    return (
      <View
        style={{
          width:DeviceWidth,
          height:DeviceHeight,
          alignItems:'center',
          flexDirection:'column',
          top:0,
          left:0,
          backgroundColor:colors.outerSpace,
          position:'absolute',
          justifyContent:'center',
          flex:1,
          padding:20,
          paddingBottom:80,
      }}>

      <Image style={{height:260,width:200, marginBottom:20}} resizeMode={'contain'} source={require('./modals/assets/shield@2x@3x.png')}/>
    <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
       <Text   style={{
        fontSize:22,
        color:'#ffffff',
        marginVertical: 10,
        textAlign:'center',
        fontFamily:'montserrat',fontWeight:'800',
      }}>YOUR PIC HAS  BEEN FLAGGED</Text>
    <Text textAlign="center" style={{
                  fontSize:18,
                  textAlign:'center',
                  color:colors.white,
                  marginBottom:40
                }}>{this.props.user.flagged_reason || ''}</Text>
                </View>
           <View
              style={{
                width:DeviceWidth,
                height:DeviceHeight,
                position:'absolute',
                bottom:0,left:0,right:0,
                height:80,
                backgroundColor:colors.mediumPurple
              }}>
            <ContinueButton customText={'UPLOAD A NEW PIC'} canContinue={true} handlePress={this.handleContinue.bind(this)}/>

            </View>
      </View>
    )
  }
}

reactMixin(ImageFlagged.prototype, TimerMixin)

ImageFlagged.displayName = 'ImageFlagged'
export default ImageFlagged
