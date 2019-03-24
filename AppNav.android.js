import {StackNavigation,withNavigation} from '@exponent/ex-navigation';
import React from 'react'
import {View, Dimensions, BackHandler, StatusBar, DrawerLayoutAndroid} from 'react-native'
import { connect } from 'react-redux'

import colors from './utils/colors'
import Router from './Router'
import Settings from './components/screens/settings/settings'
import {FloatHorizontal, FloatVertical} from './ExNavigationStylesCustom'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

// @withNavigation
class AppNav extends React.Component {


  componentDidMount(){

  }
  componentWillReceiveProps(nProps) {
    if(nProps.drawerOpen && !this.props.drawerOpen) {
      this.settingsdrawer.openDrawer()
    }
    if(!nProps.canDrawerOpen && this.props.canDrawerOpen){
      this.setDrawerClosed()
    }
  }
  setDrawerClosed(){
    // StatusBar.setTranslucent(false);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackHandler.bind(this))
    this.props.setDrawerClosed()
  }
  setDrawerOpen(){

    BackHandler.addEventListener('hardwareBackPress', this.handleBackHandler.bind(this))
    this.props.setDrawerOpen()
  }
  handleBackHandler(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackHandler.bind(this))
    this.settingsdrawer.closeDrawer()
    return this.props.canDrawerOpen
  }

  render() {
    return (
      <View style={{width: DeviceWidth, height: DeviceHeight, backgroundColor: colors.outerSpace}}>

        <DrawerLayoutAndroid
          drawerWidth={DeviceWidth * 0.85}
          ref={(d) => { this.settingsdrawer = d }}
          onDrawerOpen={this.setDrawerOpen.bind(this)}
          onDrawerClose={this.setDrawerClosed.bind(this)}
          drawerLockMode={this.props.canDrawerOpen ? 'unlocked' : 'locked-closed'}
          drawerBackgroundColor={colors.outerSpace}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => <Settings />}
        >
          <StackNavigation

            id="exnavigation"
            sceneStyle={{
                  // overflow: 'visible',
                  // shadowColor: '#000',
                  // shadowOpacity: 0.5,
                  backgroundColor: colors.outerSpace,
                  // shadowRadius: 6
            }}
            defaultRouteConfig={{
              styles: FloatVertical,
              sceneStyle: {
                backgroundColor: colors.outerSpace,
              },
              statusBar: {
                translucent: false,
                visible:true,
                backgroundColor: colors.mediumPurple70
              },
              navigationBar: {
                visible: false,
                borderBottomWidth: 0,
                tintColor: '#fff',
                borderWidth: 0,
                translucent: false,
                height:55,
                style: { height:55,},
                backgroundColor: colors.shuttleGrayAnimate,
                titleStyle: {
                  color: '#fff',
                  fontFamily: 'montserrat',
                  borderBottomWidth: 0,
                  fontWeight: '800'
                }
              },
            }}
            initialRoute={Router.getRoute('Potentials')}
          />
        </DrawerLayoutAndroid>

      </View>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  drawerOpen: state.ui.drawerOpen,
  canDrawerOpen: state.auth.api_key && state.ui.currentIndex == 0 && !state.ui.profileVisible
})


const mapDispatchToProps = dispatch => ({
  setDrawerOpen: () => dispatch({type: 'SET_DRAWER_OPEN'}),
  setDrawerClosed: () => dispatch({type: 'SET_DRAWER_CLOSED'}),
  dispatch
});


export default connect(mapStateToProps, mapDispatchToProps)(AppNav)
