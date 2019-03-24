import { Text, View, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import React, { Component } from 'react';

import ActionMan from '../../actions'
import colors from '../../utils/colors';
import styles from './purpleModalStyles';
import PurpleModal from './PurpleModal'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


class ReportModal extends Component{

  constructor() {
    super();
  }

  report(them, reason){
    let likeUserId;
    const likeStatus = 'deny';
    const relstatus = this.props.user.relationship_status;
    const rel = relstatus == 'single' ? 'couple' : 'single';

    if (this.props.match){
      const theirIds = Object.keys(this.props.match.users).filter((u) => u != this.props.user.id && u != this.props.user.partner_id);
      likeUserId = theirIds[0];
    } else if (this.props.potential){
      likeUserId = this.props.potential.user.id;
    }


//
    // this.props.goBack && this.props.goBack(them && them.id ? them : them[0]);
    // this.props.close && this.props.close()
    // if(!this.props.close && !this.props.goBack){
      // if (this.props.potential && this.props.navigator){
      //   this.props.navigator.pop()
      // }
      this.props.dispatch(ActionMan.killModal())
      this.props.dispatch(ActionMan.reportUser(likeUserId, reason))
      this.props.dispatch(ActionMan.SwipeCard({likeUserId, likeStatus, rel: (this.props.rel || rel), relstatus}));
      this.props.dispatch({ type: 'CLOSE_PROFILE' });
    // }
  }

  render(){
    let them = [];
    if (this.props.match){
      const {match} = this.props
      const theirIds = Object.keys(match.users).filter((u) => u != this.props.user.id && u != this.props.user.partner_id)
      them = theirIds.map((id) => match.users[id])
    } else {
      const {potential} = this.props;
      them = [potential.user];
      if (potential.partner && potential.partner.id != 'NONE' && potential.partner.gender){
        them.push(potential.partner)
      }
    }

    const matchName = them.length > 1 ? them.map(user => user.firstname.trim().toUpperCase()).join(' & ') : them[0].firstname.trim().toUpperCase()

    return (
      <PurpleModal>

        <View
          style={[{bottom:0,position:'absolute',top:0,right:0,left:0,bottom:0,justifyContent:'center',alignItems:'center'}]}
        >



            <Text
              style={[
                styles.rowtext, styles.bigtext, {
                  fontFamily: 'montserrat',
                  fontSize: 20,
                  marginVertical: 10
                }
              ]}
            >REPORT {matchName}</Text>

            <Text
              style={[
                styles.rowtext, styles.bigtext, {
                  fontSize: 20,
                  marginVertical: 10,
                  color: colors.white,
                  marginHorizontal: 0
                }
              ]}
            >Is this person bothering you? Tell us what they did.</Text>

            <View
              style={{
                marginTop: 30,
                alignSelf: 'stretch'
              }}
            >
              <TouchableHighlight
                style={styles.modalButtonWrap}
                underlayColor={colors.sushi}
                onPress={() => { this.report(them, 'image') }}
              >
                <View
                  style={styles.modalButton}
                >
                  <Text
                    style={styles.modalButtonText}
                  >OFFENSIVE BEHAVIOR</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor={colors.sushi}
                style={styles.modalButtonWrap}
                onPress={() => { this.report(them, 'fake') }}
              >
                <View
                  style={[styles.modalButton]}
                >
                  <Text
                    style={styles.modalButtonText}
                  >FAKE USER</Text>
                </View>
              </TouchableHighlight>

              <TouchableOpacity
                style={styles.modalButtonWrap}
                onPress={() => {
                  this.props.dispatch(ActionMan.killModal())

                  this.props.goBack && this.props.goBack(them && them.id ? them : them[0]);
                  this.props.close && this.props.close()
                }}
              >
                <View
                  style={[styles.modalButton, styles.cancelButton]}
                >
                  <Text
                    style={styles.modalButtonText}
                  >CANCEL</Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>

      </PurpleModal>

    )
  }
}
ReportModal.displayName = 'ReportModal'


export default ReportModal
