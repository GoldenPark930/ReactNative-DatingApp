// // import UserDefaults from 'react-native-userdefaults-ios'
// import doLogOut from './logout';
//
// export default userDefaults = () => (
// UserDefaults.boolForKey('ResetDataOnLaunch')
//   .then(ResetDataOnLaunch => {
//
//
//     if(ResetDataOnLaunch){
//
//       return doLogOut().then(() => UserDefaults.setBoolForKey(false, 'ResetDataOnLaunch'))
//       .then(result => {
//         __DEV__ && console.log(result);
//         resolve(ResetDataOnLaunch)
//       })
//       .catch(reject)
//     }
//   })
//   .catch(reject)
// )
