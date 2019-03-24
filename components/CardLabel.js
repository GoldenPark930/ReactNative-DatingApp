import React from 'react'
import { Text, View } from 'react-native'
import { pure } from 'recompose'

import styles from './screens/potentials/styles'
import CityState from './CityState'

const CardLabel = pure(({potential, city = '', textColor, matchName, cacheCity, afterNameIcon, cityStateStyle, hideCityState, nameStyle, showDistance}) => {
  const distance = showDistance ? (potential.user._rankingInfo.matchedGeoLocation.distance/1609).toFixed(0) : null
  return (
  <View
    pointerEvents={'none'}
    style={{
      flexDirection: 'column',
      flexGrow: 1,
      borderBottomLeftRadius: 11,
      borderBottomRightRadius: 11,

    }}
  >
    <View
      pointerEvents={'none'}
      style={{
        flexDirection: 'row',
      }}
    >
      <Text
        style={[
          styles.cardBottomText,
          {color: textColor},
          nameStyle || {}
        ]}
        key={`${potential.user.id}-names`}
      >{ matchName }</Text>
      {afterNameIcon ? afterNameIcon : null}
    </View>

    {showDistance ?   <View style={{backgroundColor: 'transparent', height: 30}}>
      <Text
        style={[
          styles.cardBottomOtherText,
        ]}
      >{`${Math.max(1,distance) == 1 ? 'Around ':''}${Math.max(1,distance)} mile${ Math.max(1,distance) == 1 ? '' : 's'} away` }</Text>
    </View> : null}

    {!hideCityState && <CityState
      key={'matchName'}
      userId={potential.user.id}
      cityState={potential.user.cityState}
      potential={potential}
      cityStateStyle={cityStateStyle}
      color={textColor}
      cacheCity={cacheCity}
      coords={{lat: potential.user.latitude, lng: potential.user.longitude}}
                       />}

  </View>
)
});

export default CardLabel
