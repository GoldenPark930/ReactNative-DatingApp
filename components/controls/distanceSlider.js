
import React from 'react';

import {Slider, Text, StyleSheet, View} from 'react-native';
import { MagicNumbers } from '../../utils/DeviceConfig'
import colors from '../../utils/colors'

class DistanceSlider extends React.Component{

  constructor(props){
    super()
    this.state = {
      val: props.val
    }
  }
  componentWillReceiveProps(nProps){
    if(nProps.val != this.state.val){
      this.setState({val:nProps.val})
    }
  }
  render(){
    return (
      <View style={styles.container} >
        <View
          style={{
            paddingHorizontal: 0,
            flexDirection: 'row',
            width: MagicNumbers.screenWidth,
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              alignSelf: 'flex-start',
              color: colors.rollingStone,
              textAlign: 'left',
              fontFamily: 'omnes'
            }}
          >{'Distance'}</Text>

          <Text
            style={{
              alignSelf: 'flex-end',
              fontFamily: 'omnes',
              color: colors.white,
              textAlign: 'right',
              marginRight: 0,
            }}
          >{`${this.state.val} miles`}</Text>
        </View>

        <Slider
          value={this.props.val}
          style={styles.slider}
          minimumValue={5}
          maximumValue={250}
          step={1}
          minimumTrackTintColor={colors.mediumPurple}
          maximumTrackTintColor={colors.white}
          onValueChange={val => {
            this.setState({val: parseInt(val)})
          }}
          onSlidingComplete={(value) => {
            this.props.handler(parseInt(value))
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    left: 0,
    paddingHorizontal: 20,
    right: 0
  },
  slider: {
    alignSelf: 'stretch',
    flex: 1,
    left: 0,
    right: 0
  },


});

export default DistanceSlider;
