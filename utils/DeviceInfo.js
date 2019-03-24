import RNDeviceInfo from 'react-native-device-info'

class DeviceInfo {

  static get = () => ({
    uuid: RNDeviceInfo.getUniqueID(),
    version: RNDeviceInfo.getSystemVersion(),
    platform: RNDeviceInfo.getSystemName(),
    name: RNDeviceInfo.getDeviceName(),
    locale: RNDeviceInfo.getDeviceLocale(),
    country: RNDeviceInfo.getDeviceCountry(),
    model: RNDeviceInfo.getModel(),
    app_build: RNDeviceInfo.getBuildNumber(),
    app_version: RNDeviceInfo.getVersion(),
    manufacturer: RNDeviceInfo.getManufacturer(),
    userAgent: RNDeviceInfo.getUserAgent(),
    timezone: RNDeviceInfo.getTimezone()
  })
}

export default DeviceInfo

// before:
// const {RNDeviceInfo} = NativeModules
// const DeviceInfo = {
//   uuid: RNDeviceInfo.uniqueId,
//   version: RNDeviceInfo.systemVersion,
//   platform: RNDeviceInfo.systemName,
//   name: RNDeviceInfo.deviceName,
//   locale: RNDeviceInfo.deviceLocale,
//   country: RNDeviceInfo.deviceCountry,
//   model: RNDeviceInfo.deviceModel
// }
