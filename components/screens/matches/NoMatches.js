import { Text, Image, View, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import FadeInContainer from '../../FadeInContainer';
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const NoMatches = () => (
  <ScrollView
    contentContainerStyle={{
      backgroundColor: colors.outerSpace,
      width: DeviceWidth,
      height: DeviceHeight-60
    }}
    showsVerticalScrollIndicator={false}
    automaticallyAdjustContentInsets
    style={{
      backgroundColor: colors.outerSpace,
      flexGrow: 1,
      alignSelf: 'stretch',
      height: DeviceHeight-60,
      paddingTop:60,
      width: DeviceWidth
    }}
  >
    <FadeInContainer
      delayAmount={1500}
      duration={1000}
    >
      <View
        style={{
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          alignSelf: 'stretch',
          paddingBottom: 0,
          paddingTop: 0
        }}
      >
        <Image
          style={{
            width: DeviceWidth - MagicNumbers.screenPadding-20,
            height: MagicNumbers.is5orless ? 50 : 60,
            marginBottom: 20,
            alignSelf:'flex-start'
          }}
          source={require('./assets/listing@3x.png')}
          resizeMode={Image.resizeMode.contain}
        />
        <Image
          style={{
            width: DeviceWidth - MagicNumbers.screenPadding-20,
            height: MagicNumbers.is5orless ? 50 : 60,
            marginBottom: 20,
            alignSelf:'flex-start'

          }}
          source={require('./assets/listing@3x.png')}
          resizeMode={Image.resizeMode.contain}
        />
        <Image
          style={{
            width: DeviceWidth - MagicNumbers.screenPadding-20,
            height: MagicNumbers.is5orless ? 50 : 60,
            marginBottom: 50,
            alignSelf:'flex-start'

          }}
          source={require('./assets/listing@3x.png')}
          resizeMode={Image.resizeMode.contain}
        />
<View style={{
  padding: MagicNumbers.screenPadding / 2,
}}
>
        <Text
          style={{
            color: colors.white,
            fontSize: MagicNumbers.is5orless ? 18 : 22,
            fontFamily: 'montserrat',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: 20
          }}
        >{ 'WAITING FOR MATCHES' }</Text>
        <Text
          style={{
            color: colors.shuttleGray,
            fontSize: MagicNumbers.is5orless ? 18 : 20,
            fontFamily: 'omnes',
            textAlign: 'center'
          }}
        >{ 'Your conversations with your matches will appear in this screen.' }</Text>
      </View>
      </View>
    </FadeInContainer>
  </ScrollView>
)


export default NoMatches;
