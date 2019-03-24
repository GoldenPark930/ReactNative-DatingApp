import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation, NavigationStyles } from '@exponent/ex-navigation';
import PermissionModal from './PermissionModal/PermissionModal';

class LocationPermissionsModal extends Component {
  render() {
    return (
      <PermissionModal
        {...this.props}
        title={'PRIORITIZE LOCAL'}
        firstSubtitle={'We have found some users we think you might like'}
        secondSubtitle={'Should we prioritize the users closets to you?'}
        permissionKey={'location'}
        buttonText={'YES PLEASE'}
        permissionLabel={'Location'}
        onSuccess={() => {this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_ON'})}}
        renderImage={() => (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              position: 'relative',
              width: 260,
              height: 260
            }}
          >
            <Image
              style={[{
                borderRadius: 60,
                left: 0,
                top: 0,
                margin: 70,
                position: 'absolute',
                width: 120,
                height: 120
              }]}
              source={this.props.user.image_url ? {uri: this.props.user.image_url} : require('./assets/iconModalDenied@3x.png')}
            />
            <Image
              style={{
                left: 0,
                top: 0,
                marginVertical: 0,
                padding: 0,
                position: 'absolute',
                width: 260,
                height: 260,
              }}
              resizeMode="cover"
              source={require('./assets/localIcon@3x.png')}
            />
          </View>
        )}
        showMap={"true"}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
    permissions: state.permissions
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationPermissionsModal);
