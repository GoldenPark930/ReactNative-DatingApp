import ReactNative, { AppRegistry,SnapshotViewIOS } from "react-native";
import path from 'path'
const ScreensList = [
    './components/welcome',
    './components/pin',
    './screens/CheckMark',
    './screens/imageFlagged',
    './screens/FacebookImageSource',
// './screens/registration/facebook',
// './screens/registration/bday',
// './screens/registration/gender'
  // require('./components/pin'),
  // require('./screens/CheckMark'),
  // require('./components/welcome')
]

// console.log(ScreensList);


ScreensList.forEach(screenFile => {

    let Screen = require(screenFile);
    let name = Screen.default ? (Screen.default.displayName || null) : (Screen.displayName || null);
  // console.log('-----'+name+'---');
    if(!name){
        let parsed = path.basename(screenFile);
    // console.log(parsed);
        name = parsed[0].toUpperCase() + parsed.substring(1);
    }
  // console.log("Screen: "+name);
    const Snapshotter = (props => <SnapshotViewIOS><Screen {...props}/></SnapshotViewIOS>)
    AppRegistry.registerComponent(name, () => Snapshotter);

});

// console.log(AppRegistry.getAppKeys());
