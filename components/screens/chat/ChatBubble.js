
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import React from 'react';

import dismissKeyboard from 'dismissKeyboard'
import NoMessages from './NoMessages'
import Analytics from '../../../utils/Analytics';
import { BlurView, VibrancyView } from 'react-native-blur'
import FadeInContainer from '../../FadeInContainer';
import TimeAgo from '../../controls/Timeago';
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
import MessageComposer from './MessageComposer'
import { connect } from 'react-redux';
import styles from './chatStyles'
import {pure,onlyUpdateForKeys} from 'recompose'
import ActionMan from  '../../../actions/';

const ChatBubble = (props) => {
  const isMessageOurs = (props.from_user_info.id == props.user.id || props.from_user_info.id == props.user.partner_id);
  var thumb = ''
  if(!isMessageOurs){
    const {from_user_info} = props;
    const {thumb_url,image_url} = from_user_info;
     thumb = (image_url)+'';
  }else{
     thumb = '';

  }
  const timestamp = Math.min(props.created_timestamp * 1000, Date.now());

    return (
      <View style={[styles.col]} shouldRasterizeIOS={true}>
        <View style={[styles.row,{alignItems: isMessageOurs ? 'flex-end' : 'flex-start',}]}>
          <View
            style={{
              flexDirection: 'column',
              flexGrow:1,
              alignItems: isMessageOurs ? 'flex-end' : 'flex-start',
              alignSelf:  isMessageOurs ? 'flex-end' : 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexGrow:10,
                alignSelf: isMessageOurs ? 'flex-end' : 'flex-start',
                justifyContent:isMessageOurs ? 'flex-end' : 'flex-start',
                alignItems: 'center',
                maxWidth: MagicNumbers.screenWidth,
                flexDirection: 'row'
              }}
            >

            {!isMessageOurs ?
              <View style={[{backgroundColor:colors.dark},styles.thumb]}>
              <Image style={[styles.thumbwrap]}
                  source={{uri: thumb}}
                  resizeMode={Image.resizeMode.cover}
                  defaultSource={require('./assets/placeholderUser.png')}
                />
              </View> : null
            }

            { !isMessageOurs ?
              <Image
                resizeMode={Image.resizeMode.contain}
                source={require('./assets/TrianglePurple@3x.png')}
                style={{left:1,width:10,height:22,opacity:1}}
              /> : null
            }

            {isMessageOurs ? <View style={{flexGrow:10}}/> : null}

            <View style={[styles.bubble,{ },(isMessageOurs ? styles.ourMessage : styles.theirMessage)]}>

              {!isMessageOurs && <Text
                style={[styles.messageText, styles.messageTitle, {
                  color: isMessageOurs ? colors.shuttleGray : colors.lavender,
                  fontFamily:'montserrat',
                }]}
              >{ props.from_user_info.name.toUpperCase() }</Text>}

              <Text
                style={[styles.messageText,{
                  fontFamily:'omnes',
                  flexGrow:1
                }, props.specialText && {
                  fontSize: props.specialText,
                  // lineHeight: 60,
                  paddingBottom:2
                }]}
              >{ props.text }</Text>

            </View>
            {!isMessageOurs ? <View style={{flexGrow:10}}/> : null}

            {isMessageOurs ?
              <Image
                resizeMode={Image.resizeMode.contain}
                source={require('./assets/TriangleDark@3x.png')}
                style={{right:0,width:10,height:22,tintColor:colors.darks,opacity:1}}
              /> : null
            }
            </View>
          </View>
        </View>

        <View
          style={[{
            paddingHorizontal:20,
            marginBottom:10,
            marginLeft: isMessageOurs ? 2 : 62,
            alignSelf: isMessageOurs ? 'flex-end' : 'flex-start'
          }]}
        >
          <TimeAgo
            showSent={true}
            style={{
              color:colors.shuttleGray,
              fontSize:10,
              fontFamily:'montserrat'
            }}
            time={timestamp}
          />
        </View>

      </View>
    );

};

export default pure(onlyUpdateForKeys(['created_timestamp'])(ChatBubble))


const SIZES = {
      big:{
        dimensions:{
          closed: 200,
          open: 140,
        },
        margin:{
          closed: 40,
          open: 20,
        }
      },
      small: {
        dimensions:{
          closed: 100,
          open: 50
        },
        margin:{
          closed: 20,
          open: 10,
        }
      }
   };
