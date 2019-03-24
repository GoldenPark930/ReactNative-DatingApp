import React from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation, NavigationStyles } from '@exponent/ex-navigation';
import PermissionModal from './PermissionModal/PermissionModal';
import Router from '../../Router';

@withNavigation
class LocationPermissionsModal extends React.Component{

  static route = {
    styles: NavigationStyles.SlideVertical,
    navigationBar: {
      visible:false,
    }
  };

  render() {
    return (
      <PermissionModal
        {...this.props}
        title={'LOCATION'}
        subtitle={'Should we prioritize the matches nearest to you?'}
        permissionKey={'location'}
        buttonText={'USE MY LOCATION'}
        nextOnboardScreen={() => {
          this.props.navigator.immediatelyReplaceStack([Router.getRoute('Potentials', {})])
        }}
        permissionLabel={'Location'}
        onSuccess={() => {this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_ON'})}}
        renderImage={() => (
          <View
            style={{
              width: 200,
              height: 200,
              marginVertical: 10,
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              style={[{
                width: 100,
                height: 100,
                borderRadius: 50,
                top: 0,
                left: 0,
                margin: 50,
                position: 'absolute'
              }]}
              source={this.props.user.image_url ? {uri: this.props.user.image_url} : require('./assets/iconModalDenied@3x.png')}
            />
            <Image
              style={{
                width: 200,
                height: 200,
                marginVertical: 0,
                top: 0,
                left: 0,
                padding: 0,
                position: 'absolute'
              }}
              resizeMode="cover"
              source={require('./assets/localIcon@3x.png')}
            />
          </View>
        )}
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
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationPermissionsModal);
