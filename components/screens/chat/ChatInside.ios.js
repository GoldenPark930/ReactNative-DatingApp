import React, {Component} from 'react'
import { View, ListView, Dimensions, } from 'react-native'
import moment from 'moment'
import _ from 'lodash'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NoMessages from './NoMessages'
import Analytics from '../../../utils/Analytics';
import colors from '../../../utils/colors';
import MessageComposer from './MessageComposer'
import emojiCheck from '../../../utils/emoji-regex';
import ActionMan from '../../../actions/';
import ChatBubble from './ChatBubble'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

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
      kbHeight: 0
    }
  }

  componentDidMount(){
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

  componentWillUnmount(){
    this.props.dispatch({type: 'MARK_CHAT_READ', payload: {match_id: this.props.match.match_id}})
  }

  onEndReached(){
    if(!this.props.messages){ return }
    const nextPage = parseInt(this.props.messages.length / 20) + 1;
    if(this.state.fetching || nextPage == this.state.lastPage){ return }

    this.setState({
      lastPage: nextPage,
      isRefreshing: false,
      loadingMore: true
    })

    Analytics.event('Interaction', {type: 'scroll', name: 'Load more messages', page: nextPage})

  }

  onTextInputChange(textInputValue){
    this.setState({ textInputValue })
  }

  sendMessage(msg){
    const timestamp = moment().utc().unix();
    this.props.dispatch(ActionMan.createMessage(msg, this.props.match.match_id, timestamp))
    if(this.scroller) this.scroller.scrollTo({x: 0, y: 0});
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

  render(){
    const matchInfo = this.props.currentMatch || this.props.matchInfo;
    if(!matchInfo){
      return <View/>
    }

    return (
      <View
        style={{
          flexGrow: 10,
          alignSelf: 'stretch',
          flexDirection: 'column',
          backgroundColor: colors.outerSpace,
          height: DeviceHeight - 60,
          position: 'relative',
        }}
      >
        {this.props.messages && this.props.messages.length > 0 ? (
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            onEndReached={this.onEndReached.bind(this)}
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
                keyboardDismissMode={'interactive'}
                contentContainerStyle={{}}
                style={{ backgroundColor: colors.outerSpace, }}
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

        <View
          style={{}}
        >
          <MessageComposer
            textInputValue={this.state.textInputValue}
            onTextInputChange={this.onTextInputChange.bind(this)}
            sendMessage={this.sendMessage.bind(this)}
          />
        </View>
        <KeyboardSpacer onToggle={(keyboardState) => {
          this.setState({
            isKeyboardOpened: keyboardState
          })
        }}/>

      </View>
    )
  }
}


export default ChatInside
