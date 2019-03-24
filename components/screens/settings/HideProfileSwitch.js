import React from 'react'
import reactMixin from 'react-mixin'
import { Text, View, Switch, Settings, PushNotificationIOS, Platform, NativeModules, Dimensions } from 'react-native'
import {connect} from 'react-redux'
import ActionMan from '../../../actions/'
import Analytics from '../../../utils/Analytics'

import colors from '../../../utils/colors'
import styles from './settingsStyles'

const iOS = Platform.OS == 'ios';

class HideProfileSwitch extends React.Component{
  constructor(props){
    super()
    this.state = { }
  }

  toggleProfileVisible(){
    const {profileVisible} = this.props

    Analytics.event('Interaction', {
      name: 'Toggle profile visible',
      type: 'tap',
      value: profileVisible
    })

    if(profileVisible){
      this.props.dispatch(ActionMan.hideProfile())

    }else{
      this.props.dispatch(ActionMan.showProfile())

    }
  }

  render(){
    const {profileVisible} = this.props;

    return (
      <View style={{paddingHorizontal: 40,marginTop:50}}>

        <View style={[styles.insideSelectable, styles.formRow, {borderBottomWidth: 0}]}>
          <Text style={{color: colors.white, fontSize: 18, fontFamily:'omnes'}}>Show me on Trippple</Text>
          <Switch
            onValueChange={this.toggleProfileVisible.bind(this)}
            value={profileVisible}
            onTintColor={colors.dark}
            thumbTintColor={profileVisible ? colors.mediumPurple : colors.shuttleGray}
            tintColor={colors.dark}
          />
        </View>

      </View>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  profileVisible: state.user.profile_visible,
})


const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(HideProfileSwitch);
