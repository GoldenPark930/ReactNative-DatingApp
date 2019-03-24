import {StackNavigation, NavigationContext, NavigationProvider} from '@exponent/ex-navigation';
import React from 'react'
import {View, Dimensions, StatusBar} from 'react-native'
import colors from './utils/colors'
import Router from './Router'

const DeviceHeight = Dimensions.get('window').height;


export default class AppNav extends React.Component {

  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.outerSpace,}}>
        <StatusBar
          animated
          backgroundColor={colors.outerSpace20}
          barStyle="default"
          translucent
          showHideTransition={'slide'}
        />
        <StackNavigation
          id="exnavigation"
          sceneStyle={{
            backgroundColor: colors.outerSpace,
          }}
          ref={n => this.n = n}
          defaultRouteConfig={{
            statusBar: {
              barStyle:'default'
            },
            navigationBar: {
              visible: true,
              borderBottomWidth: 0,
              translucent: false,
              tintColor: '#fff',
              backgroundColor: 'rgba(0,0,0,0)',
              titleStyle: {
                color: '#fff',
                fontFamily: 'montserrat',
                borderBottomWidth: 0,
              }
            },
          }}
          initialRoute={Router.getRoute('Potentials')}
        />
      </View>
    )
  }
}
