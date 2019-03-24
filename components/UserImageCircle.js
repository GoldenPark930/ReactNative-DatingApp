import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { NavigationActions, withNavigation } from '@exponent/ex-navigation';
import {connect} from 'react-redux'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors';

@withNavigation
class UserImageCircle extends Component{

  static defaultProps = {
    diameter: DeviceWidth / 2 - 20
  }
  state = {loading:false}
  render(){

    const {id, thumbUrl, onPress,dispatch,overrideStyles = {}} = this.props

    return (
      <TouchableOpacity
        onPress={() => {
          const nav = this.props.navigation.getNavigatorByUID(this.props.navState.currentNavigatorUID)
          nav.push('FBPhotoAlbums', {});
        }}
        style={{marginTop: 0, }}
      >
        <View style={{height:this.props.diameter,width: this.props.diameter}}>
          <Image
            style={[styles.userimage, overrideStyles]}
            key={`${id}thumb`}
            defaultSource={require('./screens/settings/assets/placeholderUser@3x.png')}
            resizeMode={Image.resizeMode.cover}
            onLoadStart={e => {
              // console.log('image load',e)
              this.setState({loading:true})
            }}
            onLoadEnd={e => {
              // console.log('image load END',e)
              this.setState({loading:false})
            }}
            source={thumbUrl ? {uri: thumbUrl} : null}
          />
          <View style={styles.circle}>
            <Image
              style={{width: 18, height: 18}}
              source={require('./screens/settings/assets/cog@3x.png')}
              resizeMode={Image.resizeMode.contain}
            />
          </View>
        {this.state.loading ? (
          <View
            style={{alignSelf: 'center', zIndex: 1999,height:this.props.diameter,width: this.props.diameter,position:'absolute',top:0,left:0,alignItems: 'center', flexGrow: 1, justifyContent: 'center'}}
          >
            <ActivityIndicator
              animating
              size="large"
              color={colors.white}
            />
          </View>
        ) : null
        }
      </View>

      </TouchableOpacity>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({ ...ownProps, navState: state.navigation })

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(UserImageCircle);

const styles = StyleSheet.create({


  userimage: {
    padding: 0,
    width: DeviceWidth / 2 - 20,
    height: DeviceWidth / 2 - 20,
    alignItems: 'center',
    borderRadius: ((DeviceWidth / 2 - 20) / 2),
    overflow: 'hidden'
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: colors.mediumPurple,
    position: 'absolute',
    top: 8,
    left: 8,
    justifyContent: 'center',
    alignItems: 'center'
  }

})
