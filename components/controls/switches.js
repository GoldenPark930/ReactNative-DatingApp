
import React from "react";
import {SwitchIOS, Text, View} from "react-native";

const ToggleSwitch = React.createClass({
  getInitialState() {
    return {
      eventSwitchIsOn: false,
      eventSwitchRegressionIsOn: true,
    };
  },
  render() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <View>
          <SwitchIOS
            onValueChange={(value) => this.setState({eventSwitchRegressionIsOn: value})}
            style={{marginBottom: 10}}
            value={this.state.eventSwitchRegressionIsOn} />
        </View>
      </View>
    );
  }
});

export default ToggleSwitch;
