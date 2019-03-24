import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

import colors from '../../utils/colors'

const VerifiedCoupleBadge = ({leftBoxStyles, placementStyle}) => (
  <View style={[styles.iconButton, placementStyle]}>
    <View style={[styles.iconButtonLeftBox, leftBoxStyles]}>
      <Image
        style={{width: 12, height: 10, tintColor: colors.mediumPurple}}
        resizeMode={'contain'}
        source={require('./checkmarkWhiteSmall@3x.png')}
      />
    </View>
    <View style={styles.iconButtonRightBox}>
      <Text style={styles.iconButtonText}>VERIFIED COUPLE</Text>
    </View>
  </View>
)


export default VerifiedCoupleBadge


const styles = StyleSheet.create({

  iconButton: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    right: 50,
    bottom: 10,
    justifyContent: 'center',
    height: 22,
    width: 150,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: colors.mediumPurple20,
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: colors.mediumPurple,

    // width: 120
    // marginVertical:10
  },
  iconButtonLeftBox: {
    width: 22,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
    borderRightWidth: 2,
    borderColor: colors.mediumPurple,
    flexDirection: 'column',
    padding: 5,
    backgroundColor: colors.mediumPurple20,
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  iconButtonLeftBoxSingles: {
    backgroundColor: colors.darkSkyBlue20,
    borderRightColor: colors.darkSkyBlue,
    borderRightWidth: 1

  },
  iconButtonRightBox: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 0,
    borderBottomRightRadius: 2,
    borderTopRightRadius: 2,
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: colors.mediumPurple,

  },
  iconButtonText: {
    color: colors.mediumPurple,
    fontFamily: 'montserrat',
    fontSize: 12,
    top: -1,
    textAlign: 'center'
  },
});
