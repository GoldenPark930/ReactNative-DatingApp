import { View, SwipeableListView, ListView,Dimensions,StatusBar,Platform,Image,Text, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import { connect } from 'react-redux';
import {NavigationStyles,withNavigation} from '@exponent/ex-navigation'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import {SlideHorizontalIOS} from '../../../ExNavigationStylesCustom'

import ActionMan from '../../../actions/';
import colors from '../../../utils/colors';
import MatchesList from './MatchesList'
const iOS = Platform.OS == 'ios';

function rowHasChanged(r1, r2) {
  return r1 !== r2 || r1.match_id !== r2.match_id || r1.unread != r2.unread || r1.recent_message.message_id !== r2.recent_message.message_id
}

@withNavigation
@reactMixin.decorate(TimerMixin)
class Matches extends Component {
  static route = {
    styles: Platform.select({ios: SlideHorizontalIOS, android: NavigationStyles.FloatVertical}),
    sceneStyle:{
      backgroundColor: colors.outerSpace,
    },
    statusBar:{
      translucent:false,
      animated:true,
      visible:false
    },
    navigationBar: {
      visible: true,
      translucent: false,
      backgroundColor: colors.shuttleGrayAnimate,
      title(){
        return 'MESSAGES'
      },
      renderRight(route, props){
        return false
      }
    }
  };

  constructor(props) {
    super();
    this.ds = iOS ? SwipeableListView.getNewDataSource(rowHasChanged) : new ListView.DataSource({rowHasChanged});
    const m = props.matches.map(d => ({
      match: {...d, unread: props.unread[d.match_id]}
    }));
    this.state = {
      matches: props.matches,
      currentMatch: null,
      isVisible: false,
      dataSource: iOS ? this.ds.cloneWithRowsAndSections(m) : this.ds.cloneWithRows(m)
    }
  }

  componentWillReceiveProps(newProps) {

    this._updateDataSource(newProps.matches, 'matches')
  }

  toggleModal() {
    this.setState({
      isVisible: !this.state.isVisible,
    })
  }

  _updateDataSource(data) {
    const ds = iOS ? SwipeableListView.getNewDataSource(rowHasChanged) : new ListView.DataSource({rowHasChanged});
    const m = data.map(d => ({
      match: {
        ...d,
        unread: this.props.unread[d.match_id]
      }
    }));
    const newState = {
      matches: data,
      dataSource: iOS ? ds.cloneWithRowsAndSections(m) : ds.cloneWithRows(m)
    };
    this.setState(newState)
  }

  render() {
    return (
      <View>


        <MatchesList
          dispatch={this.props.dispatch}
          user={this.props.user}
          dataSource={this.state.dataSource}
          matches={this.state.matches || this.props.matches}
          unread={this.props.unread}
          newMatches={this.props.newMatches}
          getMessages={this.props.getMessages}
          updateDataSource={this._updateDataSource.bind(this)}
          id={'matcheslist'}
          navigator={this.props.navigator}
          route={{ component: 'Matches', title: 'Matches', id: 'matcheslist', }}
          title={'matchlist'}
        />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  matches: state.matchesList.matches,
  user: state.user,
  newMatches: state.matchesList.newMatches,
  unread: state.unread
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  getMessages: (mid) => d => d(ActionMan.getMessages(mid))
})

Matches.displayName = 'Matches';

export default connect(mapStateToProps, mapDispatchToProps)(Matches);
