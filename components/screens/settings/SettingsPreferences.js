
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  ScrollView,
  Dimensions,
  Animated,
  PixelRatio,
  NativeModules,
  Platform,
  Image,
  AsyncStorage,
} from 'react-native'

import React from 'react';
import dismissKeyboard from 'dismissKeyboard'

import AgePrefs from '../../controls/AgePrefs';
import FieldModal from '../../modals/FieldModal';
import PermissionSwitches from '../../controls/PermissionSwitches';
import colors from '../../../utils/colors';
import styles from './settingsStyles';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import ActionMan from '../../../actions'
import Selectable from '../../controls/Selectable'
import {connect} from 'react-redux'
import DistanceSlider from '../../controls/distanceSlider'
import {
  NavigationStyles,
} from '@exponent/ex-navigation';
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'

const iOS = Platform.OS == 'ios';

class SettingsPreferences extends React.Component{

  static route = {
    styles: iOS ? SlideHorizontalIOS : FloatHorizontal,
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      visible: true,
      translucent: false,
      tintColor: '#fff',
      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
        fontWeight: '800'
      },
      title(){
        return 'PREFERENCES'
      }
    },
    statusBar: {
      translucent: false,
    },
  };
  constructor(props){
    super()
    this.state = {
      bio: null,
      scroll: 'on',
      looking_for_mf: props.user.looking_for_mf || false,
      looking_for_mm: props.user.looking_for_mm || false,
      looking_for_ff: props.user.looking_for_ff || false,
      looking_for_m: props.user.looking_for_m || false,
      looking_for_f: props.user.looking_for_f || false,
    }
  }

  onPressSelectable(field){
    this.toggleField(field)
  }

  toggleField(field){
    const newState = {}
    newState[field] = !this.state[field]
    this.setState(newState)
    this.props.dispatch(ActionMan.updateUser(newState))
  }

  toggleScroll(direction){
    this.setState({scroll: direction})
  }

  editBio(){
    this.props.dispatch(ActionMan.showInModal({
      component: 'FieldModal',
      passProps: {
        inputField: 'textarea',
        field: {
          label: 'What are you looking for in a Match?',
          field_type: 'textarea'
        },
        updateOutside: this.updateBio.bind(this),
        title: 'PREFERENCES',
        fieldName: 'bio',
        fieldValue: this.state.bio || this.props.user.bio || '',
        cancel: () => {this.props.dispatch({type:'KILL_MODAL'})}
      }
    }))
  }
  updateBio(v){
    // console.log('update outside',v);
    this.setState({bio: v})
  }

  render(){
    const {looking_for_mf, looking_for_mm, looking_for_ff, looking_for_f, looking_for_m} = this.state
    const values = {looking_for_mf, looking_for_mm, looking_for_ff, looking_for_f, looking_for_m}
    return (

      <View style={{backgroundColor: colors.outerSpace, flex: 1, paddingTop: 0}}>
        <ScrollView
          showsVerticalScrollIndicator={false}



          style={{}}
          scrollEnabled={this.state.scroll == 'on' ? true : false}
        >
          <View style={[styles.paddedSpace, {marginTop: 0}]}>
            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>
                What are you looking for in a Match?
              </Text>
            </View>
          </View>

          <View style={{marginTop: 10}}>
            <TouchableHighlight underlayColor={colors.dark} onPress={this.editBio.bind(this)}>
              <View style={styles.textareaWrap}>
                <Text numberOfLines={2} style={styles.bioText}>
                  {this.state.bio ? this.state.bio : this.props.user.bio ? this.props.user.bio : ''}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

          <View style={[styles.paddedSpace, {marginBottom: 0}]}>
            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>{'Show Me'}</Text>
            </View>
          </View>

          <View>
            {this.props.user.relationship_status == 'single' && <Selectable
              field={'looking_for_mf'}
              onPress={this.onPressSelectable.bind(this, 'looking_for_mf')}
              label={'Couples (MALE/FEMALE)'}
              values={values}
              selected={this.state.looking_for_mf}
              moreStyle={defaultStyles.selectable}
                                                                />}
            {this.props.user.relationship_status == 'single' && <Selectable
              field={'looking_for_mm'}
              onPress={this.onPressSelectable.bind(this, 'looking_for_mm')}
              label={'Couples (MALE/MALE)'}
              selected={this.state.looking_for_mm}
              moreStyle={defaultStyles.selectable}
              values={values}
                                                                />}
            {this.props.user.relationship_status == 'single' && <Selectable
              field={'looking_for_ff'}
              selected={this.state.looking_for_ff}
              moreStyle={defaultStyles.selectable}
              onPress={this.onPressSelectable.bind(this, 'looking_for_ff')}
              label={'Couples (FEMALE/FEMALE)'}
              values={values}
                                                                />}
            {this.props.user.relationship_status == 'couple' && <Selectable
              field={'looking_for_f'}
              onPress={this.onPressSelectable.bind(this, 'looking_for_f')}
              label={'SINGLE FEMALES'}
              selected={this.state.looking_for_f}
              moreStyle={defaultStyles.selectable}
              values={values}
                                                                />}
            {this.props.user.relationship_status == 'couple' && <Selectable
              field={'looking_for_m'}
              selected={this.state.looking_for_m}
              moreStyle={defaultStyles.selectable}
              onPress={this.onPressSelectable.bind(this, 'looking_for_m')}
              label={'SINGLE MALES'}
              values={values}
                                                                />}
          </View>
          <View style={{paddingTop: 50}}>

            <AgePrefs
              toggleScroll={this.toggleScroll.bind(this)}
              user={this.props.user}
              dispatch={this.props.dispatch}
            />

            <DistanceSlider
              handler={(val) => {
                this.props.dispatch(ActionMan.updateUser({match_distance:val}))
                this.props.dispatch(ActionMan.fetchPotentials())
              }}
              val={this.props.user.match_distance || 10}
            />


            <PermissionSwitches {...this.props} />
          </View>

        </ScrollView>
      </View>


    )
  }
}

SettingsPreferences.displayName = 'SettingsPreferences'

const mapStateToProps = (state, ownProps) => {
  return {...ownProps, user: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPreferences);


const defaultStyles = StyleSheet.create({
  selectable: {
    width: DeviceWidth-20,
    height: 60,
    flexGrow:0,
    overflow:'hidden',
    flexDirection:'row',
    alignItems:'center',
    alignSelf:'center',
    borderWidth: 0,
    justifyContent:'space-between',
    backgroundColor:'transparent',
    paddingHorizontal: 0
  }
})
