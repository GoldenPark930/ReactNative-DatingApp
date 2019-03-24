
import { NativeModules, AsyncStorage } from  'react-native'
import base64 from 'base-64'
import Analytics from './Analytics'

import Promise from 'bluebird'

const { join, all } = Promise;
import { connect } from 'react-redux';

const { SettingsManager } = NativeModules
import DeviceInfo from './DeviceInfo'

class AppTelemetry{
  async getPayload(){

    const telemetryPayload = {
            DeviceInfo: DeviceInfo.get(),
    };

    try{
      return telemetryPayload;
    }catch(err){
      Analytics.log(err)
      return err
    }
  }

  async getEncoded(){
    try{
      const payload = await this.getPayload()
      return await base64.encode(unescape(encodeURIComponent(JSON.stringify(payload))));

    }catch(err){
      Analytics.log(err)
      return err
    }


  }
}



const mapStateToProps = (state, ownProps) => {

  return { ...ownProps, appState: state }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default new connect(mapStateToProps, mapDispatchToProps)(AppTelemetry);
