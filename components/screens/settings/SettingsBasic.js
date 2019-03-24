import { StyleSheet, Text, View, TouchableHighlight, Platform, TouchableOpacity, Dimensions, TextInput, ScrollView, Animated, Picker, Image, DatePicker, Navigator, } from 'react-native';
import React from "react";
import dismissKeyboard from 'dismissKeyboard'
import { connect } from 'react-redux'
import moment from 'moment'
import Analytics from '../../../utils/Analytics';
import FieldModal from '../../modals/FieldModal';
import ScrollableTabView from '../../scrollable-tab-view';
import SelfImage from '../../SelfImage';
import colors from '../../../utils/colors';
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import {MagicNumbers} from '../../../utils/DeviceConfig'
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'
import PropTypes from 'prop-types';

import {
  NavigationStyles, withNavigation
} from '@exponent/ex-navigation';
import ProfileField from '../../controls/ProfileField'
const iOS = Platform.OS == 'ios';


@withNavigation
class SettingsBasic extends React.Component{

  static route = {
    styles: iOS ? SlideHorizontalIOS : FloatHorizontal,
    sceneStyle:{

    },
    statusBar: {
      translucent: false,
    },
    navigationBar: {
      visible:true,
      translucent: false,
      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
        fontWeight:'800'
      },
      tintColor: '#fff',
      backgroundColor: colors.shuttleGrayAnimate,
      title(params){
        return `EDIT PROFILE`
      }
    }
  };
  constructor(props){
    super(props)
  }
  onPressFacebook(fbUser){
    this.setState({fbUser});
  }
  _pressNewImage(){
    this.props.navigator.push({
      component: SelfImage,
      sceneConfig: Navigator.SceneConfigs.PushFromRight,
      passProps: {
        user: this.props.user,
      }
    });
  }

  render(){
    let user = this.props.user;
    let settingOptions = this.props.settingOptions || {};
    const singleImage = this.props.user.localUserImage || {uri: this.props.user.image_url },
      singleImageThumb = this.props.user.localUserImage || {uri: this.props.user.thumb_url };

    return (



      <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth,paddingTop:0,height:DeviceHeight,overflow:'hidden',flex:1}}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{height:DeviceHeight-110}}
          tabLabel={'GENERAL'}
        >
          <View style={[{ paddingBottom:40}]}>

            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>Personal Info</Text>
            </View>

            {['firstname'].map((field,i) => (
                <ProfileField
                    locked={true}
                    navigation={this.props.navigation}
                    key={field+'key'+(i*10)}
                    user={this.props.user}
                    dispatch={this.props.dispatch}
                    navigator={this.props.navigator}
                    fieldName={field}
                    field={settingOptions[field]}
                />
            ))}

            {['birthday'].map((field,i) => {
              return (
                <ProfileField locked={true} dispatch={this.props.dispatch} key={field+'keybd'+(i*1000)} user={this.props.user} navigator={this.props.navigator} navigation={this.props.navigation} fieldName={'birthday'} field_type={'date'} field={settingOptions[field]} label={'bday'} />
              )
            })}
            {['gender'].map((field,i) => {
              return (

                <ProfileField locked={true} dispatch={this.props.dispatch} key={field+'key'+(i*1000)} user={this.props.user} navigator={this.props.navigator} navigation={this.props.navigation} fieldName={field} field={settingOptions[field]} />
              )
            })}
            <View style={[styles.formHeader,{marginTop:10,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}]}>
              <Image
                  style={{width:12,height:12,marginRight:5}}
                  source={require('./assets/icon-lock@3x.png')}
                  resizeMode={Image.resizeMode.contain}
              />
              <Text style={styles.formHeaderText}> Edit on Facebook</Text>
            </View>

            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>Details</Text>
            </View>
            <View style={{alignSelf:'stretch',alignItems:'stretch',flex:1,width:DeviceWidth,paddingBottom:0}}>
              {['height','body_type','ethnicity','eye_color','hair_color','smoke','drink'].map((field,i) => {
                return (
                  <View key={field+'key'+(i*10000)} style={{alignSelf:'stretch',alignItems:'stretch',width:DeviceWidth}}>
                    <ProfileField
                        dispatch={this.props.dispatch}
                        user={this.props.user}
                        navigator={this.props.navigator}
                        fieldName={field}
                        navigation={this.props.navigation}
                        field={settingOptions[field]}
                    />
                  </View>
                )
              })}
            </View>

          </View>
        </ScrollView>


      </View>


    )
  }
}

SettingsBasic.displayName = "SettingsBasic"



const mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsBasic);



const styles = StyleSheet.create({


  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    position:'relative',
    alignSelf: 'stretch',
    backgroundColor:colors.outerSpace,
    height:DeviceHeight+100,

  //  overflow:'hidden'
  },
  inner:{
    alignItems: 'stretch',
    backgroundColor:colors.dark,
    flexDirection:'column',
    height:DeviceHeight,
    justifyContent:'flex-start'
  },

  blur:{

    alignSelf:'stretch',
    alignItems:'center',
    paddingTop: 0,
    paddingBottom: 40,

  },

  phoneInput: {
    height: 60,
    padding: 8,
    flex:1,
    width:MagicNumbers.screenWidth,
    alignSelf:'stretch',
    fontSize: 26,
    fontFamily:'montserrat',
    color: colors.white
  },

  formHeader:{
    marginTop:40,
    marginHorizontal:MagicNumbers.screenPadding/2
  },
  formHeaderText:{
    color: colors.rollingStone,
    fontFamily: 'omnes'
  },
  formRow: {
    alignItems: 'center',
    flexDirection: 'row',

    alignSelf: 'stretch',
    paddingTop:0,
    height:50,
    flex:1,
    borderBottomWidth: 1,
    borderBottomColor: colors.rollingStone

  },
  tallFormRow: {
    width: 250,
    left:0,
    height:220,
    alignSelf:'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sliderFormRow:{
    height:160,
    paddingLeft: 30,
    paddingRight:30
  },
  picker:{
    height:200,
    alignItems: 'stretch',
    flexDirection: 'column',
    alignSelf:'flex-end',
    justifyContent:'center',
  },
  halfcell:{
    width:DeviceWidth / 2,
    alignItems: 'center',
    alignSelf:'center',
    justifyContent:'space-around'


  },

  formLabel: {
    flex: 8,
    fontSize: 18,
    fontFamily:'omnes'
  },
  header:{
    fontSize:24,
    fontFamily:'omnes'

  },
  textfield:{
    color: colors.white,
    fontSize:20,
    alignItems: 'stretch',
    flex:1,
    textAlign: 'left',
    fontFamily:'montserrat',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width:(DeviceWidth/2),

  },

  tabs: {
    height: 50,
    flexDirection: 'row',
    marginTop: 0,
    borderWidth: 1,
    flex:1,
    backgroundColor:colors.dark,
    width:DeviceWidth,
    overflow:'hidden',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: colors.dark,
  },
  userimage:{
    backgroundColor:colors.dark,
    width:120,height:120,borderRadius:60,alignSelf:'center',

  },
  displayTextField:{
    height: 60,
    alignSelf: 'stretch',
    padding: 8,
    fontSize: 30,
    fontFamily:'montserrat',
    color: colors.white,
    flex:1,
    width:MagicNumbers.screenWidth,
    textAlign:'center',
  },
  wrapperBirthdayGender:{
    height:60,
    borderBottomWidth:1,
    borderColor:colors.shuttleGray,
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row',
    marginHorizontal:MagicNumbers.screenPadding/2,
    alignSelf: 'stretch',
  },
  paddedSpace:{
    paddingHorizontal:MagicNumbers.screenPadding/2
  }
});

let TAB_UNDERLINE_REF = 'TAB_UNDERLINE';


let CustomTabBar = React.createClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.object,
    tabs: PropTypes.array,
    pageNumber:PropTypes.number
  },

  renderTabOption(name, page) {
    let isTabActive = this.props.pageNumber === page;

    return (
      <TouchableOpacity key={name+page} onPress={() => {this.props.goToPage(page)}}>
        <View style={[styles.tab]}>
          <Text style={{fontFamily:'montserrat',textAlign:'center',fontSize:15,padding:0,color: isTabActive ? colors.white : colors.shuttleGray}}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  },

  render() {
    let numberOfTabs = this.props.tabs ? this.props.tabs.length : 0;
    let w = DeviceWidth / numberOfTabs

    let tabUnderlineStyle = {
      position: 'absolute',
      width: DeviceWidth / numberOfTabs,
      height: 2,
      backgroundColor: colors.mediumPurple,
      bottom: 0,
      left:0,
      transform: [
        {
          translateX: this.props.activeTab ? this.props.activeTab.interpolate({
            inputRange: this.props.tabs.map((c,i) => (w * i) ),
            outputRange: [0,w]
          }) : 0
        }]

    };

    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <Animated.View style={tabUnderlineStyle} ref={TAB_UNDERLINE_REF} />
      </View>
    );
  },
});
