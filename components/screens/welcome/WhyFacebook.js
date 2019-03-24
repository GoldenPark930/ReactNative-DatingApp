import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import colors from '../../../utils/colors';
import { MagicNumbers } from '../../../utils/DeviceConfig';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const WhyFacebook = ({kill}) => (
  <ScrollView style={{ width: DeviceWidth, height: DeviceHeight, backgroundColor: colors.outerSpace, padding: MagicNumbers.screenPadding}}>
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', height: DeviceHeight - 50}}>
      <Text style={[styles.allText, styles.titleText, {textAlign: 'center', marginTop: 20}]}>WHY FACEBOOK?</Text>
      <View>
        <Text style={[styles.allText, styles.titleText, {}]}>HIDE FROM YOUR FRIENDS</Text>
        <Text style={[styles.allText, {}]}>Facebook login makes it easier to hide you from Facebook friends and family</Text>
      </View>
      <View>
        <Text style={[styles.allText, styles.titleText, {}]}>NO FAKE USERS</Text>
        <Text style={[styles.allText, {}]}>Facebook does a pretty good job at purging fake users. Signing up with Facebook lowers the chances of fake users joining Trippple.</Text>
      </View>
      <View>
        <Text style={[styles.allText, {color: colors.steelGrey}]}>
          Note: We do not store inactive user information. Disabling your Tripple account will delete all of your Facebook information from Trippple.
        </Text>
      </View>
      <TouchableOpacity
        style={{backgroundColor: colors.transparent, alignSelf: 'center'}}
        onPress={() => { kill() }}
      >
        <Image source={require('../../../assets/close.png')} style={{width: 35, height: 35}} />
      </TouchableOpacity>
    </View>
  </ScrollView>
)


const styles = StyleSheet.create({
  allText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'omnes',
    textAlign: 'left',
  },
  titleText: {
    fontSize: 16,
    fontFamily: 'montserrat',
    fontWeight: '800',
  },
});

export default WhyFacebook
