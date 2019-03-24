import {
  View,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  Animated,
  Keyboard,
  Dimensions,
  Platform,
} from 'react-native';
import React from 'react';

import ThreeDots from './ThreeDots';
import Action from '../modals/Action';
import ActionMan from '../../actions'
import { connect } from 'react-redux'
import Btn from '../Btn'
import colors from '../../utils/colors'


const ThreeDotsActionButton = ({dispatch, dotColor = colors.white, style, match}) => (
  <Btn
    color={colors.white}
    style={style}
    onPress={() => {
      Keyboard.dismiss()
      dispatch(ActionMan.showInModal({
        component: 'Action',
        passProps: {
          match,
          fromChat: true,
          style: {width: 50}
        }
      }))
    }}
  >
    <ThreeDots
      dotColor={dotColor}
    />
  </Btn>
)
const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  match: ownProps.match || state.matches[state.ui.chat && state.ui.chat.match_id] || state.newMatches[state.ui.chat && state.ui.chat.match_id]
})

const mapDispatchToProps = (dispatch) => ({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDotsActionButton)
