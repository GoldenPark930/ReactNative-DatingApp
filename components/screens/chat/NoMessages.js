import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, Keyboard, TouchableOpacity, LayoutAnimation, ScrollView, Animated, Dimensions } from 'react-native';
import FadeInContainer from '../../FadeInContainer';
import MessageComposer from './MessageComposer';
import TimeAgo from '../../controls/Timeago';
import colors from '../../../utils/colors';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {pure} from 'recompose'
import {MagicNumbers} from '../../../utils/DeviceConfig'

export default class NoMessages extends React.Component{
  constructor(props){
    super()
    this.state = {}
  }

  getThumbSize(top = false){

    const size = MagicNumbers.is5orless ? SIZES.small : SIZES.big;
    const isKeyboardOpened = this.props.isKeyboardOpened;

    return {
      width: isKeyboardOpened ? size.dimensions.open : size.dimensions.closed,
      height: isKeyboardOpened ? size.dimensions.open : size.dimensions.closed,
      borderRadius: isKeyboardOpened ? size.dimensions.open / 2 : size.dimensions.closed / 2,
      marginVertical: isKeyboardOpened ? size.margin.open : size.margin.closed,
      top: top ? ( isKeyboardOpened ? 0 : 0 ) : 0
    }
  }

  render(){
    const isKeyboardOpened = this.props.isKeyboardOpened;
    const matchInfo = this.props.match || this.props.currentMatch || this.props.matchInfo,
      theirIds = Object.keys(matchInfo.users).filter(u => u != this.props.user.id && u != this.props.user.partner_id),
      them = theirIds.map((id) => matchInfo.users[id]),
      chatTitle = them.reduce((acc, u, i) => { return acc + u.firstname.toUpperCase() + (them[1] && i == 0 ? ' & ' : '') }, '');
    const imgHeight = isKeyboardOpened ? 100 : 200;
    const match_user = them[0] || {};
    return (

        <FadeInContainer delayAmount={1000} duration={1000}>
          <View style={{flexDirection: 'column', justifyContent: 'center', top: 0, alignItems: 'center', alignSelf: 'stretch',  paddingBottom: 0,flexGrow:10,flex:10}}>


              <View style={{width: DeviceWidth, alignSelf:'stretch', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
              <View style={{flexDirection: isKeyboardOpened ? 'row' : 'column'}}>
                <Text style={{color: colors.white, fontSize: !isKeyboardOpened ? 20 : 16, fontFamily: 'montserrat', fontWeight: '800', textAlign: 'center', }} >{
                    'YOU MATCHED WITH'+ (isKeyboardOpened ? ' ' : '')
              }</Text>

              <Text style={{color: colors.white, fontSize: !isKeyboardOpened ? 20 : 16, fontFamily: 'montserrat', fontWeight: '800', textAlign: 'center',
                }}
                >{chatTitle}</Text>
              </View>
                <View style={{}} >
                  <TimeAgo style={{color: colors.shuttleGray, fontSize: !isKeyboardOpened ? 16 : 14, fontFamily: 'omnes', }} time={matchInfo.created_timestamp * 1000} />
                </View>

                  <TouchableOpacity
                    onPress={this.props.openProfile}
                  >
                    <View style={[this.getThumbSize('top'), {backgroundColor: colors.dark,height:imgHeight,width:imgHeight}]}>

                    <Image
                      source={{uri: match_user.image_url }}
                      style={[this.getThumbSize(),{top: this.props.isKeyboardOpened ? -20 : -40,position:'absolute',height:imgHeight,width:imgHeight,borderRadius:imgHeight/2}]}
                      defaultSource={require('./assets/placeholderUser@3x.png')}
                    />
                  </View>
                </TouchableOpacity>
              <Text style={{color: colors.shuttleGray, fontSize: !isKeyboardOpened ? 20 : 16, textAlign: 'center', fontFamily: 'omnes', backgroundColor: 'transparent'}} >Say something. {
                  (them.length == 2 ? 'They\'re' : match_user.gender == 'm' ? 'He\'s' : 'She\'s')
                } already into you.</Text>
              </View>
              </View>
              </FadeInContainer>

    )
  }
}


const SIZES = {
  big: {
    dimensions: {
      closed: 200,
      open: 140,
    },
    margin: {
      closed: 40,
      open: 20,
    }
  },
  small: {
    dimensions: {
      closed: 100,
      open: 50
    },
    margin: {
      closed: 20,
      open: 10,
    }
  }
};

const styles = StyleSheet.create({
  container: {

    backgroundColor: colors.white,
    paddingTop: 0,
    paddingBottom: 50
  },
  chatContainer: {

    margin: 0,
    flexDirection: 'column',
       // alignItems: '  stretch',
    alignSelf: 'stretch',
    backgroundColor: colors.dark,

       // bottom: 50,
       // top:60
  },
  messageList: {

    flexDirection: 'column',
    alignSelf: 'stretch',
  },

  bubble: {
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'column',
    maxWidth: DeviceWidth - 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,

  },
  col: {
    flexDirection: 'column',

    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'space-around',

  },
  theirMessage: {
    backgroundColor: colors.mediumPurple,
    marginRight: MagicNumbers.is4s ? 0 : 10,
    alignSelf: 'flex-start',

  },
  ourMessage:
  {
       // marginLeft: MagicNumbers.is4s ? 0 : 10,
    backgroundColor: colors.dark,
    alignSelf: 'flex-end',

  },
  messageTitle: {
    fontFamily: 'montserrat',
    color: colors.shuttleGray,
    fontSize: 12,
    marginBottom: 5
  },

  chatInsideWrap: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: colors.dark,

    position: 'relative',
    height: DeviceHeight - 64,
    width: DeviceWidth,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '200',
       // flexWrap: 'wrap',
    color: colors.white
  },
  thumb: {
    borderRadius: MagicNumbers.is4s ? 20 : 24,
    width: MagicNumbers.is4s ? 40 : 48,
    height: MagicNumbers.is4s ? 40 : 48,
    position: 'relative',
    marginHorizontal: MagicNumbers.is4s ? 0 : 5,
    marginRight: 5
  },
  listview: {
    backgroundColor: colors.outerSpace,
       // alignSelf:'stretch',
       // bottom:80,
    flex: 1,
    width: DeviceWidth,
  },
  invertedContentContainer: {
    backgroundColor: colors.outerSpace,
    justifyContent: 'center',
    width: DeviceWidth,
  }
});
