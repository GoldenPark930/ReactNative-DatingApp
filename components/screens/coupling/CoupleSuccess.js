import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import React from 'react';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../../../utils/colors'
import {MagicNumbers} from '../../../utils/DeviceConfig'

import {NavigationStyles, withNavigation} from '@exponent/ex-navigation';

import styles from '../../modals/purpleModalStyles'
import { BlurView, VibrancyView } from 'react-native-blur'
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'

export default class CoupleSuccess extends React.Component{

  static route = {
    styles: FloatHorizontal,
    navigationBar: {
      visible: false,
      backgroundColor: colors.shuttleGrayAnimate,
      title(params) {
        return ''
      }
    }
  };

  constructor(props){
    super()
    this.state = {
      pin: '',
      submitting: false,
      absoluteContinue: true,
      verifyError: null,
      inputFieldValue: ''
    }
  }

  popToTop(){
    this.props.goBack && this.props.goBack()

    if(this.props.navigator){
      this.props.navigator.popToTop()
    }
    if(this.props.hideModal){
      this.props.hideModal()
    }
    if(this.props.close){
      this.props.close()
    }
  }

  render(){
    return (
      <View style={{flexGrow: 1,  backgroundColor: colors.outerSpace}}>
        <ScrollView
          contentContainerStyle={[{ backgroundColor: colors.outerSpace, width: DeviceWidth, height: DeviceHeight, flexDirection: 'column', justifyContent: 'center', flexGrow: 1, top: 0 }]}

          showsVerticalScrollIndicator={false}
          vertical
        >

          <Text style={[styles.rowtext, styles.bigtext, { textAlign: 'center', fontFamily: 'montserrat', fontWeight: '800', fontSize: 20, color: '#fff', marginVertical: 10 }]}>
            SUCCESS
          </Text>
          {this.props.user.partner && this.props.user.partner.gender ?
            <View style={{height: 120, marginVertical: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={[{width: 120, height: 120, borderRadius: 60, marginRight: -100}]}
                source={this.props.user.partner.image_url ? {uri: this.props.user.partner.image_url } : require('../../../assets/placeholderUser.png')}
                defaultSource={require('../../../assets/placeholderUser.png')}
              />
              <Image
                style={[{width: 120, height: 120, borderRadius: 60, marginLeft: -100}]}
                resizeMode={Image.resizeMode.cover}
                source={this.props.user.image_url ? {uri: this.props.user.image_url } : require('../../../assets/placeholderUser.png')}
                defaultSource={require('../../../assets/placeholderUser.png')}
            />
          </View> :
            <View>
              <Text style={[styles.rowtext, styles.bigtext, {
                fontSize: 18,
                marginVertical: 10,
                color: '#fff',
                fontFamily: 'omnes',

                marginBottom: 15, textAlign: 'center',
                flexDirection: 'column'
              }]}
              >Your couple will be set up shortly.</Text>
            </View>
        }

        <TouchableHighlight
          underlayColor={colors.white20}
          style={{backgroundColor: 'transparent', borderColor: colors.white, borderWidth: 1, borderRadius: 5, marginHorizontal: MagicNumbers.screenPadding, marginTop: 50, marginBottom: 15}}
          onPress={this.popToTop.bind(this)}
        >
          <View style={{paddingVertical: 20, paddingHorizontal: 20}} >
            <Text style={{fontFamily: 'montserrat', fontWeight: '800', fontSize: 18, textAlign: 'center', color: '#fff', }}>
              CONTINUE
            </Text>
          </View>
        </TouchableHighlight>

      </ScrollView>
    </View>
    )
  }
  }
