import { StyleSheet, Text, Image, View, InteractionManager, TouchableHighlight, SwipeableListView, Dimensions, Alert, } from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import ActionMan from '../../../actions/';
import Analytics from '../../../utils/Analytics';
import NewMatches from './NewMatches';
import NoMatches from './NoMatches';
import ThreeDots from '../../buttons/ThreeDots';
import colors from '../../../utils/colors';
import Btn from '../../Btn';
import {withNavigation} from '@exponent/ex-navigation';

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;
const SwipeableQuickActions = require('../../../../node_modules/react-native/Libraries/Experimental/SwipeableRow/SwipeableQuickActions');


@withNavigation
@reactMixin.decorate(TimerMixin)
class MatchesList extends Component {

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      isVisible: false,
      scrollEnabled: true,
      isRefreshing: false,
      lastPage: 0
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(ActionMan.getMatches())
      this.props.dispatch(ActionMan.getNewMatches())
    })
  }

  onEndReached() {
    const nextPage = parseInt(this.props.matches.length / 20) + 1;
    if (this.state.fetching || nextPage == this.state.lastPage) { return }

    this.setState({
      lastPage: nextPage,
      isRefreshing: false,
      loadingMoreMatches: true
    });

    this.setTimeout(() => {
      this.setState({
        loadingMoreMatches: false
      })
    }, 3000);

    Analytics.event('Interaction', {
      type: 'scroll',
      name: 'Load more matches',
      page: nextPage
    })
    this.props.dispatch(ActionMan.getMatches(nextPage))
  }

  _updateDataSource(data) {
    this.props.updateDataSource(data)
  }

  handleCancelUnmatch() {
    this.setTimeout(() => {
      this.setState(({
        unmatchOpen: false
      }))
    }, 350);
  }

  unmatch(rowData) {
    if (this.state.unmatchOpen) {
      return
    }
    this.setState({
      unmatchOpen: true
    })

    Alert.alert(
      'Remove this match?',
      'Do you want to remove this match?',
      [
        {
          text: 'Cancel',
          onPress: () => this.handleCancelUnmatch(rowData),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            Analytics.extra('Social', {
              name: 'Unmatch',
              match_id: rowData.match_id,
              match: rowData
            })
            this.props.dispatch(ActionMan.unMatch(rowData.match_id));
            this.handleCancelUnmatch();
          }
        },
      ],
    );
  }

  _pressRow(rowData, title) {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(ActionMan.getMessages({match_id: rowData.match_id}))
    });
    const payload = {
      title,
      match_id: rowData.match_id,
      matchInfo: rowData
    };
    this.props.navigator.push(this.props.navigator.navigationContext.router.getRoute('Chat', payload));
  }

  segmentedViewPress(index) {
    this.setState({
      index: index == 0 ? 0 : 1
    })
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true
    });
    this.onEndReached();
  // this.setTimeout(()=>{
  //   this.setState({
  //     isRefreshing:false
  //   })
  // },3000);
  }

  chatActionSheet(row) {
    this.props.dispatch(ActionMan.showInModal({component: 'Action', passProps: {match: row}}))
  }

  _renderRow(rowData, sectionID, rowID) {
    const theirIds = Object.keys(rowData.users).filter(u => u != this.props.user.id && u != this.props.user.partner_id);
    const them = theirIds.map((id) => rowData.users[id]);
    const threadName = them.map(user => user.firstname.trim()).join(' & ');
    const thumb = them[0].thumb_url;
    const matchImage = thumb || '';
    const unread = rowData.unread || 0;
    const messageBody = rowData.recent_message.message_body.replace(/(\r\n|\n|\r)/gm, ' ');
    __DEV__ && console.log(rowData,messageBody,threadName);
    return (
      <View style={[styles.row]}>

      <Btn
        style={[styles.row,{
          backgroundColor: colors.outerSpace,
          flexGrow: 1,
          alignSelf:'stretch',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.dark,
          padding:10,width:DeviceWidth,height:90,flexGrow: 1,}]  }
        onPress={() => { this._pressRow(rowData, threadName.toUpperCase()) }} key={`${rowData.match_id}match`}
      >

          {global.__DEBUG__ && <Text style={{ color: '#fff' }}>
            {`${new Date(rowData.recent_message.created_timestamp * 1000).toLocaleString()} | match_id: ${rowData.match_id}`}
          </Text>}

          <View style={styles.row}>
            <View style={styles.thumbswrap}>
              <Image
                key={`userimage${rowID}`}
                style={styles.thumb}

                source={{ uri: them[0].image_url }}
                resizeMode={Image.resizeMode.cover}
                defaultSource={matchImage ? matchImage : require('./assets/placeholderUser@3x.png')}
              />
              {unread ?
                <View style={styles.newMessageCount}>
                  <Text style={{ fontFamily: 'montserrat', fontWeight: '800', color: colors.white, textAlign: 'center', fontSize: 14 }}>
                    {unread}
                  </Text>
                </View>
                      : null}
            </View>
            <View style={styles.textwrap}>
              <Text style={[styles.text, styles.title]}>
                {threadName.toUpperCase()}
              </Text>
              <Text style={styles.text} numberOfLines={2}>
                {messageBody || 'New Match'}
              </Text>
            </View>
         </View>
      </Btn>
      </View>

    );
  }

  render() {
    return (this.props.matches && this.props.matches.length == 0 && this.props.newMatches && this.props.newMatches.length == 0) ? <NoMatches/> : (
      <View style={{flexGrow:1, backgroundColor: colors.outerSpace,}}>
        <SwipeableListView
          dataSource={this.props.dataSource}
          maxSwipeDistance={150}
          renderQuickActions={(rowData, sectionID, rowID) => (
            <SwipeableQuickActions
              style={{
                backgroundColor: colors.dark,
                alignItems: 'stretch',
                overflow: 'hidden',
                flexGrow: 1,

              }}
            >
              <TouchableHighlight
                onPress={this.unmatch.bind(this, rowData)}
                underlayColor={colors.shuttleGray}
              >
                <View
                  style={{
                    backgroundColor: colors.mandy,
                    width: 75,
                    margin: 0,
                    right: -5,
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    flexDirection: 'column',
                  }}
                >
                  <Image
                    resizeMode={Image.resizeMode.contain}
                    style={{width: 20, height: 20, alignItems: 'flex-start'}}
                    source={require('./assets/close@3x.png')}
                  />
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={this.chatActionSheet.bind(this, rowData)}
                underlayColor={colors.dark}
              >
                <View
                  style={{
                    backgroundColor: colors.shuttleGray,
                    width: 75,
                    margin: 0,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    flexDirection: 'column'
                  }}
                >
                  <ThreeDots
                    dotColor={colors.white}
                  />
                </View>
              </TouchableHighlight>
            </SwipeableQuickActions>
          )}
          bounceFirstRowOnMount={false}
          chatActionSheet={this.chatActionSheet.bind(this)}
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={200}
          contentContainerStyle={{
            flexGrow: 1,

          }}
          ref={component => { this._listView = component }}
          renderRow={this._renderRow.bind(this)}
          style={{
            height: DeviceHeight,
            // paddingTop: 60,
            flexGrow: 1,

          }}
          scrollEnabled={this.state.scrollEnabled}
          directionalLockEnabled
          removeClippedSubviews
          contentInset={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          vertical
          initialListSize={8}
          scrollsToTop
          renderHeader={() => ((!this.props.newMatches || !this.props.newMatches.length) ? false :
            (<NewMatches
              dispatch={this.props.dispatch}
              user={this.props.user}
              navigator={this.props.navigator}
              newMatches={this.props.newMatches}
              matchesCount={this.props.matches.length}
            />)
          )}
        />
        {/* {this.state.loadingMoreMatches && false ?
          <View style={{ position: 'absolute', bottom: 0, width: DeviceWidth, height: 30 }}>
            <ActivityIndicator style={{ alignSelf: 'center', alignItems: 'center', flex: 1, height: 60, width: 60, justifyContent: 'center' }} animating />
          </View> : null
          } */}
      </View>
    )
  }
}


export default MatchesList

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
    flexGrow: 1,

    backgroundColor: colors.outerSpace,
  },

  thumbswrap: {
    width: 64,
    marginRight: 20,
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    backgroundColor: colors.dark,
    justifyContent: 'flex-start',

  },
  thumb: {
    borderRadius: 32,
    width: 64,
    height: 64,
  },
  rightthumb: {
    left: -16
  },
  text: {
    color: colors.rollingStone,
    fontFamily: 'omnes',
    fontSize: 17,
    lineHeight: 17,
    overflow: 'visible',
    paddingTop:5,
  },
  title: {
    fontSize: 16,
    fontFamily: 'montserrat',
    fontWeight: '800',
    color: colors.white,
    lineHeight: 20

  },
  textwrap: {
    height: 70,
    backgroundColor:colors.outerSpace,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'visible',
    flex: 3,
    alignSelf: 'stretch'
  },
  swipeButtons: {
    width: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginLeft: 0
  },
  newMessageCount: {
    backgroundColor: colors.mandy,
    position: 'absolute',
    bottom: -5,
    right: -5,
    borderRadius: 15,
    overflow: 'hidden',
    borderColor: colors.outerSpace,
    borderWidth: 4,
    width: 30,
    height: 30,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
});
