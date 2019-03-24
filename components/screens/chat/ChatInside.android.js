import { View, TextInput, Image, ListView, Keyboard, Text, Animated, Dimensions,   KeyboardAvoidingView,TouchableOpacity, } from 'react-native';
import React, {Component} from 'react';
import moment from 'moment';
import styles from './chatStyles'
import _ from 'lodash'

import NoMessages from './NoMessages'
import Analytics from '../../../utils/Analytics';
import { BlurView, VibrancyView } from 'react-native-blur'
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
import MessageComposer from './MessageComposer'
import { connect } from 'react-redux';
import emojiCheck from '../../../utils/emoji-regex';
import ActionMan from '../../../actions/';
import ChatBubble from './ChatBubble'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ThreeDotsActionButton from '../../buttons/ThreeDotsAction';


const shouldMakeBigger = (msg) => {
  if(msg.length > 9 || msg.length == 0) return false;
  return emojiCheck().test(msg)
}

class ChatInside extends Component{
  constructor(props){
    super();

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows(props.messages || []),
      isKeyboardOpened: false,
      textInputValue: '',
      fetching: false,
      lastPage: 0,
      kbs:0
    }
  }

    componentDidMount(){
      this.props.dispatch({type: 'MARK_CHAT_READ', payload: {match_id: this.props.match.match_id}})
    }
    componentWillUnmount(){
      this.props.dispatch({type: 'MARK_CHAT_READ', payload: {match_id: this.props.match.match_id}})
    }

  componentWillReceiveProps(newProps){
    if(this.props.match && !newProps.match){
      this.props.pop();
    }
    if(!this.ds || !newProps.messages) { return }
    this.setState({
      dataSource: this.ds.cloneWithRows(_.sortBy(newProps.messages, (msg) => msg.created_timestamp).reverse())
    })
  }
  _renderRow(rowData, sectionID: number, rowID: number) {
    return (
      <ChatBubble
        specialText={shouldMakeBigger(rowData.message_body) ? 40 : null}
        user={this.props.user}
        {...rowData}
        key={`${rowID}-msg`}
        text={rowData.message_body}
        pic={rowData.from_user_info.thumb_url}
      />
    )
  }

  sendMessage(msg){
    const timestamp = moment().utc().unix();
    this.props.dispatch(ActionMan.createMessage(msg, this.props.match.match_id, timestamp))
    this.scroller && this.scroller.scrollTo({x: 0, y: 0})

  }

  onTextInputChange(text){
    this.setState({
      textInputValue: text
    })
  }


handleKeyboard(e){
  console.log(e);
}
  //
  onEndReached(e){
    if(!this.props.messages){ return false }
    const nextPage = parseInt(this.props.messages.length / 20) + 1;
    if(this.state.fetching || nextPage == this.state.lastPage){ return false }

    this.setState({
      lastPage: nextPage,
      isRefreshing: false,
      loadingMore: true
    })

    Analytics.event('Interaction', {type: 'scroll', name: 'Load more messages', page: nextPage})

  }


  render(){
    const matchInfo = this.props.currentMatch || this.props.matchInfo;
    if(!matchInfo){
      return <View/>
    }
    const theirIds = Object.keys(matchInfo.users).filter((u) => u != this.props.user.id && u != this.props.user.partner_id),
      them = theirIds.map((id) => matchInfo.users[id]),
      chatTitle = them.reduce((acc, u, i) => (acc + u.firstname.toUpperCase() + (them[1] && i == 0 ? ' & ' : '')), '');



//     return (
//       <View
//         style={{
// flex: 1,
// width:DeviceWidth,
// backgroundColor:'blue',
// marginBottom:20,
// paddingVertical:60,
//           flexDirection:'column',
//           alignItems:'stretch',
//           justifyContent:'flex-end',
//           top:0,
//           height:DeviceHeight
//         }}
//         collapsable={false}
//       >
    return (
        <View
          style={{
            flexGrow: 1,
            paddingBottom:0,
            width:DeviceWidth,
            backgroundColor: colors.transparent
          }}
        >
          <KeyboardAvoidingView
            onKeyboardChange={this.handleKeyboard.bind(this)}
            style={{ alignSelf: 'stretch', flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}
            behavior={'padding'}
            keyboardVerticalOffset={50}
          >

            {this.props.messages && this.props.messages.length > 0 ? (
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                style={{flexGrow:1,alignSelf:'stretch'}}
                messages={this.props.messages || []}
                renderScrollComponent={props => (
                  <InvertibleScrollView
                    {...props}
                    inverted
                    scrollsToTop
                    scrollEventThrottle={16}
                    indicatorStyle={'white'}
                    ref={c => { this.scroller = c }}
                    key={`${this.props.match_id}x`}
                  />
                )}
              />
            ) : (
              <NoMessages
                {...this.props}
                textInputValue={this.state.textInputValue}
                onTextInputChange={this.onTextInputChange.bind(this)}
                sendMessage={this.sendMessage.bind(this)}
                isKeyboardOpened={this.state.isKeyboardOpened}
                openProfile={this.props.openProfile}
              />

            )}

            <MessageComposer
              isKeyboardOpen={this.state.isKeyboardOpened}
              textInputValue={this.state.textInputValue}
              onTextInputChange={this.onTextInputChange.bind(this)}
              sendMessage={this.sendMessage.bind(this)}
            />




          </KeyboardAvoidingView>


      </View>
    )
  }
}


export default ChatInside
