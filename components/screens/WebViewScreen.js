import React, {Component} from 'react';
import {StyleSheet, View,Platform,WebView, Dimensions} from 'react-native';
import colors from '../../utils/colors';
import {SlideHorizontalIOS, FloatHorizontal} from '../../ExNavigationStylesCustom'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const iOS = Platform.OS == 'ios';

const helpScript = `
  jQuery(document).ready(function($){
    $('a').each(function(i,el){
      var s = $('<span></span>',{html: $(el).html()});
      $(el).replaceWith(s)
    });
    $('button').remove();
  })
`;

const privacyScript = `
  jQuery(document).ready(function($){
    $('button').hide();
    window.setTimeout(function(){
      $('a').each(function(i,el){
        var s = $('<span></span>',{html: $(el).html()});
        $(el).replaceWith(s)
      });
    },1000)
  })
`;

class WebViewScreen extends Component{

  static route = {
    styles: iOS ? SlideHorizontalIOS : FloatHorizontal,
    sceneStyle:{

    },
    navigationBar: {
      visible:true,
      translucent:false,
      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
        fontWeight:'800'
      },
      tintColor: '#fff',
      backgroundColor: colors.shuttleGrayAnimate,
      title(params){
        return params.pageTitle
      }
    }
  };

  static onNavigationStateChange(e) {
    __DEBUG__ && console.log(e);
  }

  render(){
    return (
      <View
        style={styles.container}
      >
        <WebView
          ref={wv => (this.webview = wv)}
          automaticallyAdjustContentInsets={false}
          style={styles.webview}
          source={this.props.source}
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange}
          startInLoadingState
          injectedJavaScript={this.props.source.uri.indexOf('help') >= 0 ? helpScript : privacyScript}
          scalesPageToFit
          bounces
          dataDetectorTypes={'none'}
          scrollEnabled
        />

      </View>
    )
  }
}

export default WebViewScreen


const styles = StyleSheet.create({


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 0,
    alignSelf: 'stretch',
    backgroundColor: colors.outerSpace
  },
  webview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'relative',
    alignSelf: 'stretch',
  }
});
