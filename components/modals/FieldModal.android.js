import React, { Components } from 'react';
import {
  Animated,
  AsyncStorage,
  DatePicker,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { NavigationStyles } from '@exponent/ex-navigation';
import reactMixin from 'react-mixin';
import ActionMan from '../../actions/';
import colors from '../../utils/colors';
import TrackKeyboardMixin from '../mixins/keyboardMixin';
import {MagicNumbers} from '../../utils/DeviceConfig';

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;
const PickerItem = Picker.Item;

function getMaxLength(fieldName) {
  let len = 20;
  switch (fieldName){
    case 'firstname':
      len = 15;
      break;
    case 'email':
      len = 30;
      break;
  }
  return len;
}


class FieldModal extends React.Component{

  static route = {
    navigationBar: {
      visible: false,
      backgroundColor: colors.shuttleGrayAnimate,
      title(params) {
        const fieldLabel = (params && params.title) || (params.field && params.field.label) || '';
        return fieldLabel.toUpperCase();
      }
    }
  };

  constructor(props) {
    super(props);
  
    this.state = {
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      keyboardSpace: 0,
      birthday: props.fieldValue,
      value: props.fieldValue,
      phoneValue: props.fieldValue,
      canContinue: props.field.field_type == 'dropdown' ? !!props.fieldValue : false
    }
  }

  componentWillMount() {
    if(this.props.field.field_type == 'textarea'){
      this.setState({value: this.props.fieldValue ? `${this.props.fieldValue}\n` : ''})
    }
  }

  componentDidMount() {
    if(this.props.field.field_type == 'textarea' && this._textArea){
      this._textArea.focus();
      this._textArea.setNativeProps({value: this.props.fieldValue ? `${this.props.fieldValue}\n` : ''});
    }
  }

  onChange(val) {
    if (!val) return;
  
    let isValid = true;

    if (this.props.fieldName == 'email') {
      isValid = (/.+\@.+\..+/.test(val));
    }
  
    if (val.length > 0 && isValid) {
      this.setState({
        canContinue: true,
        error: false,
        value: val.trim()
      });
    } else {
      this.setState({
        canContinue: false,
        error: true,
        value: val
      });
    }
  }

  onChangePhone({phone}) {
    if (phone.length == 10) {
      this.setState({
        canContinue: true,
        phoneValue: phone
      })
    } else {
      this.setState({
        canContinue: false,
        phoneValue: phone
      });
    }
  }

  onDateChange = (date) => {
    this.setState({birthday: date, canContinue: true});
  };

  getValueFromKey(data, key) {
    let value = null;
    Object.keys(data).forEach((i) => {
      if(i == key) {
        value = data[i];
      }
    });
    return { key, value };
  }

  submit() {
    if (!this.state.canContinue) { return false; }
    if (this.props.field.field_type == 'date') {
      const payload = {};
      const v = moment(this.state.birthday).format('MM/DD/YYYY');
      payload[`${this.props.forPartner ? 'partner_' : ''}${this.props.fieldName}`] = v;
      this.props.updateOutside && this.props.updateOutside(v);
      this.props.dispatch(ActionMan.updateUser(payload));
      this.cancel();
    } else if (this.props.field.field_type == 'phone_input') {
      
    } else {
      const payload = {};

      payload[`${this.props.forPartner ? 'partner_' : ''}${this.props.fieldName}`] = this.state.value;
      this.props.updateOutside && this.props.updateOutside(this.state.value);
      this.props.dispatch(ActionMan.updateUser(payload));
      this.cancel();
    }
  }

  onChangeDate(d) {
    this.setState({
      canContinue: true,
      birthday: d
    })
  }

  cancel() {
    this.props.cancel ? this.props.cancel() : this.props.dispatch(ActionMan.killModal());
  }

  renderCloseButton() {
    return (
      <TouchableOpacity onPress={() => this.cancel.bind(this)}>
        <Image
          resizeMode={Image.resizeMode.contain}
          style={{
            alignItems: 'flex-start',
            marginTop: 20,
            marginLeft: 20,
            width: 20,
            height: 20
          }}
          source={require('../../assets/closeWithShadow@3x.png')}
        />
      </TouchableOpacity>
    );
  }

  renderUpdateButton() {
    return (
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'stretch',
          bottom: -3,
          flexDirection: 'row',
          width: DeviceWidth,
          height: 70,
          zIndex: 9999
        }}
      >
        {(this.props.fieldValue != this.state.value) && (
          <TouchableOpacity
            onPress={() => this.submit()}
            style={{
              alignItems:'center',
              borderTopWidth: 1,
              backgroundColor: this.state.canContinue ? colors.brightPurple : 'transparent',
              borderColor: this.state.canContinue ? colors.mediumPurple : colors.rollingStone,
              borderLeftWidth: 1,
              flex: 1,
              paddingVertical: 20
            }}
          >
            <View>
              <Text
                style={{
                  color: this.state.canContinue ? colors.white : colors.rollingStone,
                  fontSize: 20,
                  fontFamily: 'montserrat',
                  textAlign: 'center'
                }}
              >
                UPDATE
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  render() {
    const { field, fieldValue } = this.props;
  
    const get_values = (typeof this.props.field.values == 'object' && Object.keys(this.props.field.values).map(key => key)) || this.props.field.values;
    const get_key_vals = (typeof this.props.field.values == 'object' && this.props.field.values) || {};
    const fieldLabel = (fieldValue.label || fieldValue);

    const displayField = (theField) => {
      switch (theField.field_type) {
        case 'MultiLineInput':
        case 'textarea':
          return (<MultiLineInput />);
        case 'input':
          return (
            <TextInput
              autoCapitalize={'words'}
              autoCorrect={false}
              autoFocus
              clearButtonMode={'always'}
              keyboardAppearance={'dark'}
              keyboardType={this.props.fieldName == 'email' ? 'email-address' : 'default'}
              maxLength={10}
              onChangeText={(text) => this.setState({text})}
              placeholder={theField.placeholder ? theField.placeholder.toUpperCase() : fieldLabel.toUpperCase()}
              placeholderTextColor={colors.white}
              returnKeyType={'done'}
              ref={component => this._textInput = component}
              style={[styles.displayTextField, {fontSize: this.props.fieldName == 'email' ? 20 : 30 }]}
            />
          );
        case 'phone_input':
          return null;
        case 'birthday':
        case 'date':
          // always add an empty option at the beginning of the array
          return null;
        case 'dropdown':
          // always add an empty option at the beginning of the array
          return (
            <Picker
              itemStyle={{
                fontSize: 24,
                color: colors.white,
                textAlign: 'center'
              }}
              selectedValue={this.props.fieldValue || theField.values[this.state.selectedDropdown] || null}
              style={{
                alignItems: 'stretch',
                alignSelf: 'center',
                backgroundColor: 'transparent',
                marginHorizontal: 0,
                width: 330,
              }}
            >
              {get_values.map((val) => {
                return (
                  <PickerItem
                    key={val}
                    label={(theField.labelPrefix || '') + (get_key_vals[val] || val) + (theField.labelSuffix || '')}
                    value={get_key_vals[val] || val}
                  />
                )}
              )}
            </Picker>
          );
        default:
          return null;
      }
    }
  
    const inputField = displayField(this.props.field)

    let purpleBorder;
  
    if (field.field_type == 'phone_input') {
      purpleBorder = this.state.canContinue || (this.state.phoneValue && this.state.phoneValue.length == 0);
    } else {
      purpleBorder = this.state.canContinue || (this.state.value && this.state.value.length == 0);
    }
  
    let borderColor = purpleBorder ? colors.mediumPurple : colors.rollingStone;
  
    if (this.state.error) borderColor = colors.mandy;

    fieldValue = (fieldValue.value || fieldValue);
    fieldValue = fieldValue ? fieldValue.toString() : '';
  
    let selectedFieldLabel = (this.state.value || fieldLabel || '');
    const selectedFieldValue = (this.state.value || fieldValue || this.props.fieldValue);

    if (typeof field.values == 'object' && selectedFieldValue) {
      selectedFieldLabel = this.getValueFromKey(field.values, selectedFieldValue).value || selectedFieldLabel;
    }

    let displayStateFieldValue = selectedFieldLabel.toString().toUpperCase();
    displayStateFieldValue = (field.labelPrefix || '') + displayStateFieldValue + (field.labelSuffix || '');

    const inside = () => {
      switch (field.field_type) {
        case 'dropdown':
          return (
            <View style={{alignSelf: 'stretch'}}>
              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginHorizontal: MagicNumbers.screenPadding,
                  width: MagicNumbers.screenWidth - MagicNumbers.screenPadding,
                  height: DeviceHeight - 260,
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    borderBottomWidth: 0,
                    borderBottomColor: purpleBorder ? colors.mediumPurple : colors.rollingStone,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      alignSelf: 'stretch',
                      color: colors.rollingStone,
                      fontSize: 20,
                      textAlign: 'center',
                      fontFamily: 'omnes',
                      marginBottom: MagicNumbers.screenPadding,
                    }}
                  >
                    {field.long_label ? field.long_label : field.label}
                  </Text>
                  <Text
                    style={{
                      borderBottomWidth: 0,
                      borderBottomColor: colors.rollingStone,
                      color: colors.white,
                      fontFamily: 'montserrat',
                      fontSize: 30,
                      marginHorizontal: MagicNumbers.screenPadding / 2,
                      padding: 8,
                      textAlign: 'center',
                      width: MagicNumbers.screenWidth - MagicNumbers.screenPadding,
                    }}
                  >
                    {displayStateFieldValue}
                  </Text>
                </View>
              </View>

              {this.renderUpdateButton()}

              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.dark,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: 0,
                  paddingBottom: 20,
                  width: DeviceWidth,
                  height: 240,
                }}
              >
                {React.cloneElement(inputField,
                  {
                    onValueChange: this.onChange.bind(this),
                    ref: (dropdown) => { this.dropdown = dropdown },
                    selectedValue: (selectedFieldValue || null)
                  }
                )}
              </View>
            </View>
          )
        case 'input':
          return (
            <View style={{alignSelf: 'stretch', flex: 2, height: DeviceHeight}}>
              <KeyboardAvoidingView
                style={{
                  alignSelf: 'stretch',
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                behavior={'height'}
              >
                <View
                  style={{
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginHorizontal: MagicNumbers.screenPadding,
                    width: MagicNumbers.screenWidth - MagicNumbers.screenPadding,
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'stretch',
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View
                      style={{
                        alignItems: 'center',
                        alignSelf: 'stretch',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingVertical: 20,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.rollingStone,
                          fontSize: 20,
                          fontFamily: 'omnes',
                          marginBottom: MagicNumbers.is5orless ? 20 : 40,
                          textAlign: 'center',
                        }}
                      >
                        {field.long_label ? field.long_label : field.label}
                      </Text>
                      <View
                        style={{
                          borderBottomWidth: 0,
                          borderBottomColor: borderColor,
                          width: MagicNumbers.screenWidth
                        }}
                      >
                        {React.cloneElement(inputField,
                          {
                            maxLength: getMaxLength(this.props.fieldName),
                            selectionColor: colors.mediumPurple,
                            defaultValue: this.props.fieldName == 'firstname' ? (fieldValue ? fieldValue.slice(0, 12) : '') : fieldValue,
                            onChangeText: (value) => {
                              this.onChange(value.trim())
                            },
                            autoCapitalize: 'characters',
                            ref: (textField) => { this.textField = textField }
                          }
                        )}
                      </View>
                      {field.sub_label ?
                        <Text
                          style={{
                            color: colors.rollingStone,
                            fontSize: MagicNumbers.is5orless ? 14 : 18,
                            textAlign: 'center',
                            fontFamily: 'omnes',
                            marginTop: 15,
                          }}
                        >
                          {field.sub_label}
                        </Text> :
                        null
                      }
                    </View>
                  </View>
                </View>
                {this.renderButtons()}
              </KeyboardAvoidingView>
            </View>
          )

        case 'phone_input':
          return (
            <View style={{
                alignSelf: 'stretch',
                flex: 1,
                justifyContent: 'space-between',
              }}
            >
              {this.renderCloseButton()}
              <View style={{
                  alignSelf: 'stretch',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: 0,
                }}
              >
                <View style={{
                    borderBottomColor: purpleBorder ? colors.mediumPurple : colors.rollingStone,
                    borderBottomWidth: 1,
                  }}
                >
                  {React.cloneElement(inputField,
                    {
                      handleInputChange: (value) => {
                        this.onChangePhone(value)
                      },
                      renderUpdateButton: this.renderUpdateButton.bind(this),
                      ref: (phoneField) => { this.phoneField = phoneField }
                    }
                  )}
                </View>
              </View>
              {this.renderUpdateButton()}
            </View>
          )
        case 'date':
          return (
            <View style={{alignSelf: 'stretch'}}>
              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginHorizontal: MagicNumbers.screenPadding,
                  width: MagicNumbers.screenWidth - MagicNumbers.screenPadding,
                  height: DeviceHeight - 260,
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 20,
                  }}
                >
                  <Text
                    style={{
                      alignSelf: 'stretch',
                      color: colors.rollingStone,
                      fontSize: 20,
                      fontFamily: 'omnes',
                      marginBottom: 40,
                      textAlign: 'center',
                    }}
                  >
                    {field.long_label ? field.long_label : field.label}
                  </Text>

                  <View
                    style={{
                      alignSelf: 'stretch',
                      borderBottomWidth: 1,
                      borderBottomColor: purpleBorder ? colors.mediumPurple : colors.rollingStone,
                      height: 50,
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: 'stretch',
                        color: colors.white,
                        fontSize: 20,
                        fontFamily: 'omnes',
                        marginBottom: 40,
                        textAlign: 'center',
                      }}
                    >
                      {moment(this.state.birthday).format('MM/DD/YYYY')}
                    </Text>
                  </View>
                </View>
              </View>
              {this.renderUpdateButton()}
              <View
                style={{
                  backgroundColor: colors.white,
                  height: 260,
                }}
              >
                {React.cloneElement(inputField,
                  {
                    date: new Date(this.state.birthday),
                    onDateChange: this.onDateChange,
                    ref: (dateField) => { this.dateField = dateField }
                  }
                )}
              </View>
            </View>
          );
        case 'textarea':
          return (
            <View
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                flexGrow: 1,
                justifyContent: 'space-between',
              }}
            >
              {this.renderCloseButton()}
              <Text
                style={{
                  color: colors.rollingStone,
                  fontFamily: 'omnes',
                  fontSize: MagicNumbers.is5orless ? 18 : 20,
                  marginTop: MagicNumbers.screenPadding,
                  textAlign: 'center',
                }}
              >
                {field.long_label ? field.long_label : field.label}
              </Text>

              <View style={{margin: 0}}>

                {React.cloneElement(inputField,
                  {
                    autoFocus: true,
                    defaultValue: fieldValue,
                    onChangeText: (value) => {
                      this.onChange(value)
                    },
                    selectionColor: colors.mediumPurple,
                  }
                )}
              </View>
              <View style={{bottom: -20}}>
                {this.renderUpdateButton()}
              </View>
            </View>
          )
      }
    }

    return (
      <View style={{flexGrow: 1}}>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            flex: 1,
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
          style={{
            flex: 1,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode={'interactive'}
        >
          {inside()}
        </ScrollView>
      </View>
    )
  }
}

class MultiLineInput extends React.Component{
  constructor(props) {
    super()
    this.state = {
      bioHeight: 170,
    }
  }

  sizeChange(e) {
    this.setState({bioHeight: e.nativeEvent.contentSize.height});
  }

  render() {
    return (
      <TextInput
        {...this.props}
        autoCapitalize={'sentences'}
        autoCorrect
        autofocus
        autoGrow
        clearButtonMode={'always'}
        keyboardAppearance={'dark'}
        maxLength={300}
        multiline
        numberOfLines={8}
        onContentSizeChange={this.sizeChange.bind(this)}
        placeholder={''}
        placeholderTextColor={colors.white}
        ref={t => (this._textArea = t)}
        returnKeyType={'done'}
        style={[{
          alignSelf: 'stretch',
          color: colors.white,
          flexGrow: 0,
          fontSize: MagicNumbers.size18 + 2,
          fontFamily: 'omnes',
          padding: 0,
          width: DeviceWidth - MagicNumbers.screenPadding
        }, {}]}
        textAlignVertical={'top'}
      />
    )
  }
}

const styles = StyleSheet.create({


  container: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: colors.outerSpace,
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  inner: {
    alignItems: 'stretch',
    backgroundColor: colors.outerSpace,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  blur: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    paddingBottom: 40,
    paddingTop: 0,
  },
  closebox: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
  },
  formHeader: {
    marginTop: 40,
  },
  formHeaderText: {
    color: colors.rollingStone,
    fontFamily: 'omnes'
  },
  formRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.rollingStone,
    paddingTop: 0,
    height: 50,
  },
  tallFormRow: {
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    width: 250,
    height: 220,
  },
  sliderFormRow: {
    paddingLeft: 30,
    paddingRight: 30,
    height: 160,
  },
  picker: {
    alignItems: 'stretch',
    alignSelf: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 200,
  },
  halfcell: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around',
    width: DeviceWidth / 2,
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
    alignItems: 'stretch',
    color: colors.white,
    flex: 1,
    fontFamily: 'montserrat',
    fontSize: 20,
    textAlign: 'left',
  },
  bottomText: {
    marginTop: 0,
    color: colors.rollingStone,
    fontFamily: 'omnes',
    fontSize: 16,
  },
  bottomErrorTextWrap: {

  },
  bottomErrorText: {
    color: colors.mandy,
    fontSize: 16,
    fontFamily: 'omnes',
    marginTop: 0,
  },
  pinInputWrap: {
    alignSelf: 'stretch',
    borderBottomColor: colors.rollingStone,
    borderBottomWidth: 2,
    height: 60,
  },
  pinInputWrapSelected: {
    borderBottomColor: colors.mediumPurple,
  },
  pinInputWrapError: {
    borderBottomColor: colors.mandy,
  },
  pinInput: {
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 30,
    padding: 8,
    height: 60,
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 60,
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 20,
    fontFamily: 'omnes',
  },
});

reactMixin(FieldModal.prototype, TrackKeyboardMixin);

const mapStateToProps = (state, ownProps) => {
  return {...ownProps };
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(FieldModal);
