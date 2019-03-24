import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../utils/colors';
import profileOptions from '../data/get_client_user_profile_options'
import {MagicNumbers} from '../utils/DeviceConfig'

const ProfileTable = ({profile}) => {

  let {body_type, height, age} = profile
  if(Number.isInteger(parseInt(body_type))){
    body_type = profileOptions.body_type.values[body_type] || ''
  }
  height = profileOptions.height.values[height] || height;

  return (
    <View
      pointerEvents={'none'}
      style={{
        width: MagicNumbers.screenWidth,
        flexDirection: 'column',
        alignItems: 'stretch'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'stretch',
          justifyContent: 'space-between',
          marginBottom: 15,
        }}
      >
        <Text style={styles.textlabel} >Gender</Text>
        <Text style={styles.whitetextlabel} textAlign={'right'}>{
            profile.gender && profile.gender == 'm' ? 'Male' : 'Female'
          }</Text>
      </View>

      {profile.age && <View style={styles.vview}>
        <Text style={styles.textlabel} >Age</Text>
        <Text
          style={styles.whitetextlabel} textAlign={'right'}
        >{age}</Text>
        </View>}

      {profile.height && <View style={styles.vview}>
        <Text style={styles.textlabel} >Height</Text>
        <Text style={styles.whitetextlabel} textAlign={'right'} >{height}</Text>
        </View>}

      {profile.body_type && <View style={styles.vview}>
        <Text style={styles.textlabel} >Body Type</Text>
        <Text style={styles.whitetextlabel} textAlign={'right'} >{body_type}</Text>
        </View>}

      {/* <View style={{borderBottomWidth:1,borderBottomColor:colors.shuttleGray,marginVertical:20}}/> */}

      {profile.eye_color ? (
        <View style={styles.vview}>
          <Text style={styles.textlabel} >Eye Color</Text>
          <Text style={styles.whitetextlabel} textAlign={'right'} >{profile.eye_color}</Text>
        </View>
        ) : null}

      {profile.hair_color ? (
        <View style={styles.vview}>
          <Text style={styles.textlabel} >Hair Color</Text>
          <Text style={styles.whitetextlabel} textAlign={'right'} >{profile.hair_color}</Text>
        </View>
        ) : null}

      {/* <View style={{borderBottomWidth:1,borderBottomColor:colors.shuttleGray,marginVertical:20}}/> */}

      {profile.ethnicity && <View style={styles.vview}>
        <Text style={styles.textlabel} >Ethnicity</Text>
        <Text style={styles.whitetextlabel} textAlign={'right'} >{profile.ethnicity}</Text>
        </View>}
      {profile.smoke && <View style={styles.vview}>
        <Text style={styles.textlabel} >Smoke</Text>
        <Text style={styles.whitetextlabel} textAlign={'right'} >{profile.smoke}</Text>
        </View>}
      {profile.drink && <View style={styles.vview}>
        <Text style={styles.textlabel} >Drink</Text>
        <Text style={styles.whitetextlabel} textAlign={'right'} >{profile.drink}</Text>
        </View>}
    </View>

  )
}
export default ProfileTable


const styles = StyleSheet.create({
  vview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  textlabel: {
    color: colors.rollingStone,
    fontFamily: 'omnes',
    fontSize: 18
  },
  whitetextlabel: {
    color: colors.white,
    fontFamily: 'omnes',
    fontSize: 18
  }
})
