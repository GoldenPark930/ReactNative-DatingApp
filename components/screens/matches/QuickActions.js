// import { StyleSheet, Text, Image, View, TouchableHighlight } from 'react-native';
// import React, { Component } from 'react';
// import Action from '../../modals/Action';
// import Analytics from '../../../utils/Analytics';
// import NewMatches from './NewMatches';
// import NoMatches from './NoMatches';
// import ThreeDots from '../../buttons/ThreeDots';
// import UserProfile from '../../UserProfile';
// import colors from '../../../utils/colors';
// import _ from 'underscore'
// import TimerMixin from 'react-timer-mixin';
// import reactMixin from 'react-mixin';
// import ActionMan from '../../../actions/';
//
// const SwipeableQuickActions = require('SwipeableQuickActions');
//
// const QuickActions = (rowData, sectionID, rowID) => (
//   <SwipeableQuickActions
//     style={{
//       backgroundColor: colors.dark,
//       alignItems: 'stretch',
//       overflow: 'hidden'
//     }}
//   >
//     <TouchableHighlight
//       onPress={this.unmatch.bind(this, rowData)}
//       underlayColor={colors.shuttleGray}
//     >
//       <View
//         style={{
//           backgroundColor: colors.mandy,
//           width: 75,
//           margin: 0,
//           right: -5,
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//           alignSelf: 'stretch',
//           flexDirection: 'column',
//         }}
//       >
//         <Image
//           resizeMode={Image.resizeMode.contain}
//           style={{width: 20, height: 20, alignItems: 'flex-start'}}
//           source={require('./assets/close@3x.png')}
//         />
//       </View>
//     </TouchableHighlight>
//     <TouchableHighlight
//       onPress={chatActionSheet.bind(this, rowData)}
//       underlayColor={colors.dark}
//     >
//       <View
//         style={{
//           backgroundColor: colors.shuttleGray,
//           width: 75,
//           margin: 0,
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//           alignSelf: 'stretch',
//           flexDirection: 'column'
//         }}
//       >
//         <ThreeDots
//           dotColor={colors.white}
//         />
//       </View>
//     </TouchableHighlight>
//   </SwipeableQuickActions>
// )
//
// export default QuickActions
