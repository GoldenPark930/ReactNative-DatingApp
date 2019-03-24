
import { RemoteConfig } from 'react-native-firebase3';

RemoteConfig.setDefaults({
  init_actions: 'getUserInfo,getPotentials,getPushToken'
});

class RC {
  static getValue = async (key) => RemoteConfig.getString(key)
}

export default RC
