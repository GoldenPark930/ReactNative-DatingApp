import { Text, Image, View, TouchableHighlight, Dimensions, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import colors from '../../utils/colors'
import ActionMan from '../../actions'
import { BlurView,VibrancyView } from 'react-native-blur'
import styles from './purpleModalStyles'
import {MagicNumbers} from '../../utils/DeviceConfig'
import BlurModal from './BlurModal'
import Btn from '../Btn'
import {connect} from 'react-redux'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

class UnmatchModal extends Component{

  constructor(props) {
    super();
    this.state = {}
  }
  unMatch(){
    this.props.dispatch(ActionMan.unMatch(this.props.match.match_id))
    this.props.goBack();
  }

  render(){
    const rowData = this.props.match,
        theirIds = Object.keys(rowData.users).filter( (u)=> u != this.props.user.id && u != this.props.user.partner_id),
        them = theirIds.map((id)=> rowData.users[id]),
        matchName = them.map( (user,i) => user.firstname.trim().toUpperCase() ).join(' & '),
        modalVisible = this.state.isVisible,
        self = this,
        matchImage = them.couple && them.couple.thumb_url || them[0].thumb_url || them[1].thumb_url;

    return (
      <BlurModal>

              <View
                style={[{bottom:0,position:'absolute',top:0,right:0,left:0,bottom:0,justifyContent:'center',alignItems:'center'}]}
              >
             <View style={{alignItems:'center'}}>
             <Image
            style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginBottom:20}]}
            source={{uri:matchImage}}
            defaultSource={{uri: 'assets/placeholderUserWhite@3x.png'}} />
                </View>

              <Text style={[styles.rowtext,styles.bigtext,{
                  fontFamily:'montserrat',fontSize:20,marginVertical:10
                }]}>UNMATCH {matchName}</Text>

              <Text style={[styles.rowtext,styles.bigtext,{
                  fontSize:20,marginVertical:10,color: colors.shuttleGray,marginHorizontal:20
                }]}>
                Are you sure?
              </Text>
              <View style={[{margin:20,width:DeviceWidth-40}]}>
                <Btn
                  color={colors.sushi}
                  style={[styles.modalButton,styles.modalButtonWrap]}
                  onPress={this.unMatch.bind(this)}>
                  <View style={[styles.modalButton]} >
                    <Text style={styles.modalButtonText}>UNMATCH</Text>
                  </View>
                </Btn>

               <Btn
                style={[styles.modalButton,styles.cancelButton,styles.modalButtonWrap]}
                onPress={this.props.goBack}
                color={colors.red}
                >
                  <Text style={styles.modalButtonText}>CANCEL</Text>
              </Btn>
              </View>

          </View>
      </BlurModal>
    )
  }
}


UnmatchModal.displayName = "UnmatchModal"

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps,mapDispatchToProps)(UnmatchModal)
