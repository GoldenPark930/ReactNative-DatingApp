import { StyleSheet, View } from 'react-native';
import React, {Component} from "react";

import colors from '../../utils/colors';

class Generic extends Component{


  static route = {
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      title(params){
        return params.pageTitle
      }
    }
  };

  render(){
    // console.log(this.props);
    return (
      <View style={styles.container}>
        {<this.props.component {...this.props} {...this.props.passProps}>{this.props.passProps.inside}</this.props.component>}
      </View>
    )
  }
}
export default Generic


const styles = StyleSheet.create({


 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'stretch',
   position:'relative',
   alignSelf: 'stretch',
   backgroundColor:colors.outerSpace
 }
});
