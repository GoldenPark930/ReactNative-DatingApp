
import React from 'react';
import {StyleSheet, Text, View, LayoutAnimation, TouchableHighlight, Image, TouchableOpacity, Animated, ActivityIndicator, ScrollView, PixelRatio, Dimensions, PanResponder, Easing} from 'react-native';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import styles from './screens/potentials/styles'
;
import ScrollableTabView from './scrollable-tab-view'
import SliderTabBar from './screens/potentials/ProfileSliderTabBar'

import TimerMixin from 'react-timer-mixin';
import colors from '../utils/colors';
import Swiper from './controls/swiper';
import ProfileTable from './ProfileTable'
import {MagicNumbers} from '../utils/DeviceConfig'

class UserDetails extends React.Component{

  constructor(){
    super()
  }

  render(){
    const {potential} = this.props;
    return (
      <View>
        { potential.partner && potential.partner.id != 'NONE' ? (
          <View
            style={{
              zIndex: 600,
              width: MagicNumbers.screenWidth,
              overflow: 'hidden',
              marginHorizontal: MagicNumbers.screenPadding / 2
            }}
          >
            <ScrollableTabView
              tabs={['1', '2']}
              renderTabBar={props => <SliderTabBar {...props} />}
            >
              <ProfileTable
                index={0}
                profile={potential.user}
                tabLabel={`${potential.user.firstname}`}
              />
              <ProfileTable
                index={1}
                profile={potential.partner}
                tabLabel={`${potential.partner.firstname}`}
              />
            </ScrollableTabView>
          </View>
        ) : (
          <View
            style={{width: MagicNumbers.screenWidth}}
          >
            {/* <View
              style={[styles.tabs, {
                marginHorizontal: MagicNumbers.screenPadding / 2,
                marginBottom: 20
              }]}
              >
              <Text
                style={{
                  fontFamily: 'montserrat',
                  fontSize: 16,
                  textAlign: 'center',
                  color: colors.white
                }}
              >
                {`${potential.user.firstname}, ${potential.user.age}`}
              </Text>
            </View> */}
            <View
              style={[styles.singleTab]}
            >
              <ProfileTable profile={potential.user} tabLabel={'single'} />
            </View>
          </View>
        )}
      </View>
    )
  }
}
export default UserDetails
