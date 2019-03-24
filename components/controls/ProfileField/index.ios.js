import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Dimensions, TextInput, ScrollView, Animated, Picker, Image, DatePicker, Navigator } from 'react-native';
import React from 'react';

import { connect } from 'react-redux'
import moment from 'moment'
import Analytics from '../../../utils/Analytics';
import FieldModal from '../../modals/FieldModal';
import ScrollableTabView from '../../scrollable-tab-view';
import SelfImage from '../../SelfImage';
import colors from '../../../utils/colors';
import Birthday from '../../controls/birthday'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import {MagicNumbers} from '../../../utils/DeviceConfig'

const currentyear = new Date().getFullYear();
const MIN_DATE = new Date().setFullYear(currentyear - 18)
const MAX_DATE = new Date().setFullYear(currentyear - 60)


import {
  NavigationStyles, withNavigation
} from '@exponent/ex-navigation';

const PickerItem = Picker.Item;


class ProfileField extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      selectedDropdown: props.user[props.fieldName] || '',
    }
  }

  formattedPhone(){
    if(!this.props.user.phone) return '';
    return formatPhone(this.props.user.phone)
  }
  goFieldModal(f){
    if(this.props.locked) return false;
    const {field} = this.props;
    this.props.navigator.push(this.props.navigation.router.getRoute('FieldModal', {
      inputField: field,
      field,
      cancel: () => {  this.props.navigator.pop() },
      fieldName: this.props.fieldName,
      title: 'PROFILE',
      forPartner: this.props.forPartner,
      fieldValue: this.props.fieldValue || this.props.user[this.props.fieldName] || (field.values && field.values.length > 0 && field.values[0]) || '',
    }))
  }
  render(){
    const field = this.props.field || {};

    const get_values = typeof field.values == 'object' && Object.keys(field.values).map(key => key) || field.values;
    const get_key_vals = typeof field.values == 'object' && field.values || {};

    if(!field.label){ return false }
    let fieldLabel = field.label || ''
    if(MagicNumbers.isSmallDevice && field.label.indexOf(' ') > 0){
      fieldLabel = field.label.substr(0, field.label.indexOf(' '))
    }

    let getValue = (this.props.user[this.props.fieldName] || '');
    getValue = (get_key_vals[getValue] || getValue);
    let displayValueText = (field.labelPrefix || '') + getValue.toString().toUpperCase() + (field.labelSuffix || '');

    if(field.field_type == 'phone_input') {
      displayValueText = this.formattedPhone();
    }

    if(field.field_type == 'date') {
      displayValueText = moment(getValue, 'YYYY-MM-DD').format('MM/DD/YYYY');
    }

    const displayFieldText = fieldLabel ? fieldLabel.toUpperCase() : '';
    return (
      <TouchableHighlight onPress={this.goFieldModal.bind(this)} underlayColor={colors.dark} style={styles.paddedSpace}>
        <View>
          <View style={{height: 60, borderBottomWidth: 1, borderColor: colors.shuttleGray, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', alignSelf: 'stretch'}}>
            <Text style={{color: colors.rollingStone, fontSize: 18, fontFamily: 'montserrat'}}>{ displayFieldText }</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: colors.white, fontSize: 18, fontFamily: 'montserrat', textAlign: 'right'}}>{ displayValueText
              }</Text>
              {this.props.locked ? <View style={{width: 20, position: 'relative', top: 5, height: 20, marginLeft: 10, right: 0}}>
                <Image
                  style={{width: 15, height: 15, }}
                  source={require('./assets/icon-lock@3x.png')}
                  resizeMode={Image.resizeMode.contain}
                />
              </View> : <View style={{width: 20, position: 'relative', top: 5, height: 20, marginLeft: 10, right: 0}}>
                <Image
                  style={{width: 15, height: 15, }}
                  source={require('./assets/edit@3x.png')}
                  resizeMode={Image.resizeMode.contain}
                />
              </View> }

            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default ProfileField


const styles = StyleSheet.create({


  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'relative',
    alignSelf: 'stretch',
    backgroundColor: colors.outerSpace,
    height: DeviceHeight + 100,

  //  overflow:'hidden'
  },
  inner: {
    alignItems: 'stretch',
    backgroundColor: colors.dark,
    flexDirection: 'column',
    height: DeviceHeight,
    justifyContent: 'flex-start'
  },

  blur: {

    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 40,

  },

  phoneInput: {
    height: 60,
    padding: 8,
    flex: 1,
    width: MagicNumbers.screenWidth,
    alignSelf: 'stretch',
    fontSize: 26,
    fontFamily: 'montserrat',
    color: colors.white
  },

  formHeader: {
    marginTop: 40,
    marginHorizontal: MagicNumbers.screenPadding / 2
  },
  formHeaderText: {
    color: colors.rollingStone,
    fontFamily: 'omnes'
  },
  formRow: {
    alignItems: 'center',
    flexDirection: 'row',

    alignSelf: 'stretch',
    paddingTop: 0,
    height: 50,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.rollingStone

  },
  tallFormRow: {
    width: 250,
    left: 0,
    height: 220,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sliderFormRow: {
    height: 160,
    paddingLeft: 30,
    paddingRight: 30
  },
  picker: {
    height: 200,
    alignItems: 'stretch',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  halfcell: {
    width: DeviceWidth / 2,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around'


  },

  formLabel: {
    flex: 8,
    fontSize: 18,
    fontFamily: 'omnes'
  },
  header: {
    fontSize: 24,
    fontFamily: 'omnes'

  },
  textfield: {
    color: colors.white,
    fontSize: 20,
    alignItems: 'stretch',
    flex: 1,
    textAlign: 'left',
    fontFamily: 'montserrat',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: (DeviceWidth / 2),

  },

  tabs: {
    height: 50,
    flexDirection: 'row',
    marginTop: 0,
    borderWidth: 1,
    flex: 1,
    backgroundColor: colors.dark,
    width: DeviceWidth,
    overflow: 'hidden',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: colors.dark,
  },
  userimage: {
    backgroundColor: colors.dark,
    width: 120, height: 120, borderRadius: 60, alignSelf: 'center',

  },
  displayTextField: {
    height: 60,
    alignSelf: 'stretch',
    padding: 8,
    fontSize: 30,
    fontFamily: 'montserrat',
    color: colors.white,
    flex: 1,
    width: MagicNumbers.screenWidth,
    textAlign: 'center',
  },
  wrapperBirthdayGender: {
    height: 60,
    borderBottomWidth: 1,
    borderColor: colors.shuttleGray,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: MagicNumbers.screenPadding / 2,
    alignSelf: 'stretch',
  },
  paddedSpace: {
    paddingHorizontal: MagicNumbers.screenPadding / 2
  }
});
