import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  NativeModules,
} from 'react-native';
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavigationStyles, } from '@exponent/ex-navigation';

import FBPhotoAlbums from '../FBPhotoAlbums'
import {MagicNumbers} from '../../utils/DeviceConfig'
import ActionMan from '../../actions/';
import BoxyButton from '../controls/boxyButton';
import colors from '../../utils/colors';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
// import NavigatorSceneConfigs from 'NavigatorSceneConfigs'

class FacebookImageSource extends Component{

  static route = {
    // styles: NavigationStyles.FloatVertical,
    navigationBar: {
      backgroundColor: colors.transparent,
      visible: false
    }
  };
  static propTypes = {
    imageType: PropTypes.oneOf(['profile', 'couple_profile', 'avatar']),

  };

  static defaultProps = {
    imageType: 'profile'
  };

  constructor(props){
    super();
    this.state = {
    }

  }

  componentDidMount(){
    this.onPressFacebook(this.props.fbUser)
  }

  componentWillReceiveProps(nProps){
    // console.log(nProps);
    if(!this.props.fbUser && nProps.fbUser){
      this.onPressFacebook(nProps.fbUser)
    }
  }

  onPressFacebook(fbUser){
    if(fbUser.accessToken){
      this.props.navigator.replace(this.props.navigator.navigationContext.router.getRoute('FBPhotoAlbums'), {
        ...this.props,
        image_type: this.props.image_type || this.props.imageType,
        fbUser
      })
    }else{
      // console.log('no fb auth');
      this.props.dispatch(ActionMan.facebookAuth())
      this.props.navigator.replace(this.props.navigator.navigationContext.router.getRoute('FBPhotoAlbums'), {
        ...this.props,
        image_type: this.props.image_type || this.props.imageType,
        fbUser
      })

    }
  }


  render(){

    const isCoupleImage = this.props.image_type == 'couple_profile' || this.props.imageType == 'couple_profile';
    const copy = {
      coupleTitle: 'YOUR PIC',
      singleTitle: 'YOUR PIC',
      coupleSubtitle: () => (
        <Text style={[styles.textTop, {marginTop: 0}]}>
          <Text>Pick a Facebook pic of </Text>
          <Text style={{color: colors.sushi}}>you and your partner {MagicNumbers.is4s ? null : 'together'}</Text>
          <Text>.</Text>
        </Text>
      ),
      singleSubtitle: () => (
        <Text style={[styles.textTop, {marginTop: 0}]}>
          <Text>Pick a Facebook pic of </Text>
          <Text style={{color: colors.sushi}}>yourself.</Text>
          <Text>This is the picture your matches will see during your chats.</Text>
        </Text>
      )
    }

    return (
      <View style={styles.container}>

        {/* <View style={{width:100,left:10,position:'absolute',alignSelf:'flex-start',top:-10}}>
          <BackButton navigator={this.props.navigator}/>
        </View> */}
        <View
          style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            flex: 1,
            marginTop: MagicNumbers.is5orless ? 30 : 50,
            marginBottom: MagicNumbers.is5orless ? 10 : 0
          }}
        >
          <Text style={styles.textTop}>{ isCoupleImage ? copy.coupleTitle : copy.singleTitle }</Text>

          {isCoupleImage ? copy.coupleSubtitle() : copy.singleSubtitle()}


          <View style={styles.imageHolder}>
            <Image
              source={
              isCoupleImage ?
               {uri: 'assets/iconCouplePic@3x.png'} :
                {uri: 'assets/iconSinglePic@3x.png'}
              }
              resizeMode={Image.resizeMode.contain}
              style={styles.imageInside}
            />
          </View>

          <View>

            <View style={styles.fbButton}>
              {/* <FacebookButton
              buttonType={'upload'}
              _onPress={this.onPressFacebook.bind(this)}
              key={'notthesamelement'}
              buttonText="UPLOAD FROM FB"
              shouldAuthenticate={true}
            /> */}

              <BoxyButton
                text={'LOG IN WITH FACEBOOK'}
                buttonText={this.props.buttonTextStyle}
                outerButtonStyle={styles.iconButtonOuter}
                leftBoxStyles={styles.buttonIcon}
                innerWrapStyles={styles.button}
                underlayColor={colors.cornFlower}
                _onPress={this.onPressFacebook.bind(this)}
              >

                <Image
                  source={{uri: 'assets/fBlogo@3x.png'}}
                  resizeMode={Image.resizeMode.contain}
                  style={{height: 30, width: 20, }}
                />
              </BoxyButton>

            </View>

          </View>
        </View>
      </View>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  fbUser: state.fbUser,
  loggedIn: state.auth.api_key && state.auth.user_id
})

const mapDispatchToProps = (dispatch) => ({ dispatch })
FacebookImageSource.displayName = 'FacebookImageSource'

export default connect(mapStateToProps, mapDispatchToProps)(FacebookImageSource);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: DeviceWidth,
    margin: 0,
    backgroundColor: colors.outerSpace,
    // padding:0,
    height: DeviceHeight - 60,
    padding: MagicNumbers.screenPadding / 2
  },
  twoButtons: {
    flexDirection: 'row',
    height: MagicNumbers.is5orless ? 50 : 70,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    // padding:20,
    marginTop: MagicNumbers.isSmallDevice ? 0 : 0,
    marginBottom: 0,
    width: MagicNumbers.screenWidth

  },

  plainButton: {
    borderColor: colors.rollingStone,
    borderWidth: 1,
    height: 70,
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plainButtonText: {
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily: 'montserrat',
    textAlign: 'center',
  },
  textTop: {
    marginBottom: 0,
    fontSize: MagicNumbers.is5orless ? 16 : 20,
    color: colors.rollingStone,
    fontFamily: 'omnes',
    textAlign: 'center'
  },
  imageHolder: {
    width: MagicNumbers.is5orless ? DeviceWidth / 2 - 10 : DeviceWidth / 2 + 20,
    height: MagicNumbers.is5orless ? DeviceWidth / 2 - 30 : DeviceWidth / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: MagicNumbers.is5orless ? 20 : 40
  },
  imageInside: {
    width: MagicNumbers.is5orless ? DeviceWidth / 2 - 10 : DeviceWidth / 2 + 20,
    height: MagicNumbers.is5orless ? DeviceWidth / 2 - 30 : DeviceWidth / 2,
  },
  fbButton: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    // marginHorizontal:20,
    width: MagicNumbers.screenWidth
  },

  iconButtonCouples: {
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  LogoBox: {
  },
  iconButtonOuter: {
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    height: MagicNumbers.is5orless ? 50 : 60,
    marginVertical: 15,
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
  },

  button: {
    borderColor: colors.cornFlower,
    borderWidth: 1,
    height: MagicNumbers.is5orless ? 50 : 60,

  },
  buttonIcon: {
    width: 60,
    borderRightColor: colors.cornFlower,
    borderRightWidth: 1,
    backgroundColor: colors.cornFlower20,

  },
})
