import { Platform, Dimensions, View, InteractionManager } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash'
import ActionMan from './actions/';
import {pure,onlyUpdateForKeys} from 'recompose'



const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;



@onlyUpdateForKeys(['sendingLike','internet','pendingLikes','swipeQueue'])
class LikeSender extends React.Component{


  componentWillReceiveProps(nProps){
    if(!nProps.sendingLike && nProps.pendingLikes && nProps.internet && nProps.swipeQueue[0]){
      nProps.dispatch(ActionMan.sendLike(nProps.swipeQueue[0]))
    }
  }

  render(){
    return false
  }

}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  pendingLikes: Object.keys(state.swipeQueue).length > 0,
  swipeQueue: Object.values(state.swipeQueue),
  internet: state.app.connection.isConnected,
  sendingLike: state.app.sendingLike
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(LikeSender);
