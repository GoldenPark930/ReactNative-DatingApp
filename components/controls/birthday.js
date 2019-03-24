/**
 * @flow
 */

import React from "react";

import {Text, StyleSheet, View, Picker} from "react-native";
const PickerItemIOS = Picker.Item
import colors from '../../utils/colors'

const monthList = [
'January',
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December'
];
const yearsList = [],
      currentyear = new Date().getFullYear();

for(var i = currentyear - 18; i >= currentyear - 65; i--){
  yearsList.push(i);
}

class Birthday extends React.Component{
  constructor(props) {
    super()
    this.state = {
      bday_month: props.bdayMonth,
      bday_year: props.bdayYear,
    };
  }
  updateMonth(m){
      this.setState({
        bdayMonth: m
      })
      this.props.handleChange()
  }
  updateYear(y){
    this.setState({
      bdayYear: y
    })
    this.props.handleChange()
  }
  render() {
    return (
      <View style={styles.bdaycontainer}>
        <Text style={styles.header}>Birthday </Text>
        <Text style={styles.formLabel}>Month </Text>
        <Picker
          style={styles.picker}
          selectedValue={this.state.bdayMonth}
          onValueChange={(bday_month) => this.updateMonth(bday_month)}>
          {monthList.map( (month, index) => (
              <PickerItemIOS
                key={'month_' + index}
                value={index}
                label={month}
              />
            ))
          }
        </Picker>

        <Text style={styles.formLabel}>Year </Text>

        <Picker
          key={'yearpicker'}
          style={styles.picker}
          selectedValue={this.state.bdayYear}
          onValueChange={(bday_year) => this.updateYear(bday_year)}>
          {yearsList.map( (year, index) => (
              <PickerItemIOS
                key={'y_' + index}
                value={year}
                label={year+''}
              />
            ))
          }
        </Picker>
      </View>
    );
  }
}



const styles = StyleSheet.create({

 formRow: {
   alignItems: 'center',
   flexDirection: 'row',
   justifyContent: 'center',
   paddingLeft: 15,
   paddingRight:15,
   backgroundColor:'#fff',
   height:60,
 },
 tallFormRow: {
   width: undefined,
   height:220,
   alignSelf:'stretch',
  //  alignItems: 'center',
  //  flexDirection: 'row',
  //  justifyContent: 'center'
 },
 sliderFormRow:{
   height:160,
   paddingLeft: 30,
   paddingRight:30
 },
 picker:{
   height:150,
   width:undefined,
   backgroundColor: colors.white,
   alignItems: 'stretch',
   flexDirection: 'column',
   alignSelf:'stretch',
   justifyContent:'center',
 },
 halfcell:{
   alignItems: 'center',
   alignSelf:'center',
  //  justifyContent:'space-around'


 },
 formLabel: {
   fontSize: 18,
   fontFamily:'omnes'
 },
 header:{
   fontSize:24,
   fontFamily:'omnes'

 },
 bdaycontainer:{
   height: 500,
   width: undefined
 }
});


export default Birthday;
