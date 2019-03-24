import React, { Component } from 'react';
import {
  AppState,
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActionMan from '../../../actions';
import BlurModal from '../BlurModal';
import BoxyButton from '../../controls/boxyButton';
import Button from '../../Btn';
import colors from '../../../utils/colors';
import FadeInContainer from '../../FadeInContainer';
import { MagicNumbers } from '../../../utils/DeviceConfig';
import styles from '../purpleModalStyles';

const iOS = Platform.OS == 'ios';
const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;


class PermissionsModal extends Component {

  static propTypes = {
    buttonText: PropTypes.string,
    firstSubtitle: PropTypes.string,
    isPersistant: PropTypes.bool,
    onSuccess: PropTypes.func,
    permissionKey: PropTypes.string.isRequired,
    permissionLabel: PropTypes.string.isRequired,
    renderImage: PropTypes.func,
    secondSubtitle: PropTypes.string,
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    buttonText: 'YES',
    imageStyle: {},
    isPersistant: false,
    imageSource: '../assets/iconModalDenied@3x.png'
   };

  componentDidMount() {
    this.checkPermission();
    if (this.props.permission == "denied") {
      AppState.addEventListener("change", this._handleAppStateChange.bind(this));
    }
  }

  componentWillUnmount() {
    if(this.props.permission == "denied"){
      AppState.removeEventListener("change", this._handleAppStateChange.bind(this));
    }
  }

  componentWillReceiveProps(nProps) {
    if (nProps.hasPermission && !this.props.hasPermission && this.state.opened && !this.props.isPersistant) {
      this.success()
    }
  }

  _handleAppStateChange(st) {
    if (st == 'active') {
      this.checkPermission();
    }
  }

  requestPermission() {
    this.props.dispatch(ActionMan[`request${this.props.permissionLabel}Permission`](), {});
  }

  checkPermission() {
    this.props.dispatch(ActionMan[`check${this.props.permissionLabel}Permission`](), {});
    this.setState({opened: true});
  }

  openSettings() {
    Linking.openURL('app-settings://').catch(err => console.error('An error occurred', err));
  }

  handleTap() {
    if (this.props.hasPermission == "denied") {
      this.openSettings();
    } else if (!this.props.hasPermission) {
      this.requestPermission();
    } else {
      this.success();
    }
  }

  success() {
    this.props.onSuccess && this.props.onSuccess();
    this.finish();
  }

  finish() {
    if (this.props.isModal) {
      this.props.closeModal ? this.props.closeModal() : this.props.dispatch({type: 'KILL_MODAL', payload: true});
    } else {
      this.props.nextOnboardScreen && this.props.nextOnboardScreen();
    }
  }

  cancel() {
    this.props.dispatch({type: 'SET_PERMISSION_SOFT_DENY', payload: {
      permission: this.props.permissionKey
    }});

    if( this.props.permissionKey == 'location') {
      this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_OFF'});
    }
  
    if (this.props.permissionKey == 'contacts') {
      this.props.dispatch({type: 'CHECK_CONTACTS_PERMISSION_FULFILLED', payload: false});
    }
  
    if (this.props.permissionKey == 'notifications') {
      this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_OFF'});
    }
  
    this.finish();
  }

  renderFailed() {
    return (
      <FadeInContainer duration={800} delay={1200}>
        <View style={{ alignItems: 'center', flexGrow: 1}}>
          <View style={{alignItems: 'center', backgroundColor: 'red', flexGrow: 1}}>
            <Image
              resizeMode={Image.resizeMode.contain}
              style={[{
                width: 150,
                height: MagicNumbers.is4s ? 100 : 150,
                marginBottom: MagicNumbers.is4s ? 15 : 30,
                marginTop: MagicNumbers.is4s ? 10 : 20,
              }]}
              source={require('../assets/iconModalDenied@3x.png')}
            />
          </View>
          <Text
            style={[styles.rowtext, styles.bigtext, {
              fontFamily: 'montserrat',
              fontWeight: '800',
              fontSize: 20,
              marginVertical: 0,
            }]}
          >
            CAN'T ACCESS {this.props.permissionLabel.toUpperCase()}
          </Text>
          <Text
            style={[styles.rowtext, styles.bigtext, {
              fontSize: 18, marginVertical: 10, color: colors.shuttleGray, marginHorizontal: 10
            }]}
          >
            Go to the Settings app and enable {this.props.permissionLabel} for Trippple.
          </Text>
          <View style={{marginTop: 20}}>
            <View style={{overflow: 'hidden', marginTop: 20}}>
              <Button btnText="GO TO SETTINGS" onTap={() => this.openSettings()}/>
            </View>
          </View>
        </View>
      </FadeInContainer>
    )
  }

  renderButton() {
    const buttonText = this.props.buttonText;
    const { hasPermission } = this.props;

    return this.props.isPersistant ? (
      <BoxyButton
        _onPress={() => this.handleTap()}
        buttonText={buttonStyles.buttonText}
        innerWrapStyles={[buttonStyles.innerWrapStyles, {overflow: 'hidden'}]}
        leftBoxStyles={buttonStyles.grayIconbuttonLeftBox}
        outerButtonStyle={{
          backgroundColor: 'transparent',
          flexGrow: 1,
          width: DeviceWidth - 60,
          maxHeight: 80,
        }}
        stopLoading={hasPermission}
        text={buttonText}
        underlayColor={colors.white}
      >
        {hasPermission ?
          <Image
            source={require('../assets/checkmarkWhiteSmall@3x.png')}
            resizeMode={Image.resizeMode.cover}
            style={{
              width: 30,
              height: 21,
            }}
          /> :
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: colors.white40,
              borderRadius: 10,
              width: 20,
              height: 20,
            }}
          />
        }
      </BoxyButton>
    ) : (
      <ModalButton
        btnText={buttonText}
        onTap={() => this.handleTap()}
        loading={this.props.loading}
      />
    );
  }

  render() {
    return (
      <BlurModal showMap={this.props.showMap}>
        <View style={[styles.col, {}]}>
          {this.props.hasPermission == 'denied' ? this.renderFailed() :
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: DeviceWidth,
                height: 500,
              }}
            >
              <View style={{alignItems: 'center'}}>
                {this.props.renderImage ? this.props.renderImage() :
                  <View style={{flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        resizeMode={this.props.imageResizeMode || Image.resizeMode.contain}
                        style={[{
                          marginBottom: MagicNumbers.is4s ? 15 : 30,
                          marginTop: MagicNumbers.is4s ? 10 : 20,
                          width: MagicNumbers.is4s ? 40 : 60,
                          height: MagicNumbers.is4s ? 40 : 60,
                        }, this.props.imageStyle]}
                        source={typeof this.props.imageSource == 'string' ? require(this.props.imageSource) : this.props.imageSource}
                      />
                      <Image
                        resizeMode={this.props.imageResizeMode || Image.resizeMode.contain}
                        style={{
                          marginBottom: MagicNumbers.is4s ? 15 : 30,
                          marginLeft: MagicNumbers.is4s ? 5 : 10,
                          marginTop: MagicNumbers.is4s ? 10 : 20,
                          width: MagicNumbers.is4s ? 139 : 212,
                          height: MagicNumbers.is4s ? 33 : 50,
                        }}
                        source={require('../assets/alertsBubbleMatch@3x.png')}
                      />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        resizeMode={this.props.imageResizeMode || Image.resizeMode.contain}
                        style={[{
                          marginBottom: MagicNumbers.is4s ? 15 : 30,
                          marginTop: MagicNumbers.is4s ? 10 : 20,
                          width: MagicNumbers.is4s ? 40 : 60,
                          height: MagicNumbers.is4s ? 40 : 60,
                        }, this.props.imageStyle]}
                        source={typeof this.props.imageSource == 'string' ? require(this.props.imageSource) : this.props.imageSource}
                      />
                      <Image
                        resizeMode={this.props.imageResizeMode || Image.resizeMode.contain}
                        style={{
                          marginBottom: MagicNumbers.is4s ? 15 : 30,
                          marginLeft: MagicNumbers.is4s ? 5 : 10,
                          marginTop: MagicNumbers.is4s ? 10 : 20,
                          width: MagicNumbers.is4s ? 51 : 82,
                          height: MagicNumbers.is4s ? 25 : 40,
                        }}
                        source={require('../assets/alertsBubbleType@3x.png')}
                      />
                    </View>
                  </View>
                }
              </View>
              <Text
                style={[styles.rowtext, styles.bigtext, {
                  color: colors.white,
                  fontFamily: 'montserrat',
                  fontWeight: '800',
                  fontSize: 22,
                  marginVertical: 0,
                }]}
              >{this.props.title}</Text>
              <Text
                style={[styles.rowtext, styles.bigtext, {
                  color: colors.white,
                  fontSize: 20,
                  marginHorizontal: 40,
                  marginVertical: 10,
                }]}
              >
                {this.props.firstSubtitle}
              </Text>
              <Text
                style={[styles.rowtext, styles.bigtext, {
                  color: colors.white,
                  fontSize: 20,
                  marginHorizontal: 60,
                  marginVertical: 10,
                }]}
              >
                {this.props.secondSubtitle}
              </Text>
              <View style={{marginTop: 20}}>
                {this.renderButton()}
              </View>
            </View>
          }
          <View style={{width: 400}}>
            { this.props.hasPermission ? (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  flexGrow: 1,
                  marginVertical: 10,
                  paddingHorizontal: 10,
                }}
                onPress={() => this.success()}
              >
                <View
                  style={[styles.cancelButton, {
                    alignSelf: 'center',
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                  }]}
                >
                  <Text
                    style={[{
                      alignSelf: 'center',
                      color: colors.white,
                      padding: 10,
                      paddingVertical: MagicNumbers.is4s ? 0 : 20,
                      textAlign: 'center',
                    }, styles.nothankstext]}
                  >
                    Continue
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  alignItems: 'stretch',
                  alignSelf: 'stretch',
                  flexGrow: 1,
                  marginVertical: 10,
                  paddingHorizontal: 10,
                }}
                onPress={this.cancel.bind(this)}
              >
                <View style={[styles.cancelButton, {backgroundColor: 'transparent', flexGrow: 1, alignItems: 'stretch', alignSelf: 'stretch'}]} >
                  <Text
                    style={[{
                      alignSelf: 'stretch',
                      color: colors.white,
                      textAlign: 'center',
                      marginTop: 10,
                      padding: MagicNumbers.is4s ? 0 : 10,
                    }, styles.nothankstext]}
                  >No Thanks</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BlurModal>
    )
  }
}

const ModalButton = ({btnText, onTap, loading}) => (
  <TouchableOpacity
    onPress={onTap}
    style={{
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: colors.brightPurple,
      borderRadius: 5,
      flexGrow: 1,
      justifyContent: 'center',
      maxHeight: 55,
      paddingVertical: 15,
      overflow: 'hidden',
      height: 85,
    }}
    color={colors.mediumPurple}
  >
    <View style={{paddingHorizontal: 70}}>
      <Text
        style={{
          color: colors.white,
          fontSize: 18,
          fontFamily: 'montserrat',
          fontWeight: '800',
          textAlign: 'center',
        }}
      >
        {btnText}
      </Text>
    </View>
  </TouchableOpacity>
);

const buttonStyles = StyleSheet.create({
  privacyStyle: {
    height: 60,
  },
  innerWrapStyles: {
    backgroundColor: colors.transparent,
    borderColor: colors.darkGreenBlue,
    borderWidth: 1,
    overflow: 'hidden',
  },
  iconButtonOuter: {
    marginTop: 20,
  },
  grayIconbuttonLeftBox: {
    backgroundColor: colors.darkGreenBlue40,
    borderRightColor: colors.darkGreenBlue,
    borderRightWidth: 1,
  },
  iconButtonText: {
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'montserrat',
    fontWeight: '800',
  },
})

PermissionsModal.displayName = 'PermissionsModal';

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  permissions: state.permissions,
  hasPermission: state.permissions[ownProps.permissionKey] && state.permissions[ownProps.permissionKey] != 'undetermined'
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  closeModal: () => { dispatch({ type: 'KILL_MODAL', payload: {}}) }
})

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsModal);
