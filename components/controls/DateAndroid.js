import React, {Component} from "react";

import {Text, TouchableWithoutFeedback,DatePickerAndroid} from "react-native";



class DateAndroid extends React.Component {
  static title = 'DatePickerAndroid';
  static description = 'Standard Android date picker dialog';

  state = {
    presetDate: new Date(2020, 4, 5),
    allDate: new Date(2020, 4, 5),
    simpleText: 'pick a date',
    minText: 'pick a date, no earlier than today',
    maxText: 'pick a date, no later than today',
    presetText: 'pick a date, preset to 2020/5/5',
    allText: 'pick a date between 2020/5/1 and 2020/5/10',
  };

  showPicker = async (stateKey, options) => {
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Date'] = date;
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  }
  render(){
    return (
      <TouchableWithoutFeedback
        onPress={this.showPicker.bind(this, 'min', {
          date: this.state.minDate,
          minDate: new Date(),
        })}>
        <Text style={styles.text}>{this.state.minText}</Text>
      </TouchableWithoutFeedback>
    )
  }
}
