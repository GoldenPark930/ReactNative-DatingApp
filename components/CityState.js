import React, {Component} from 'react'
import { View, Text } from 'react-native'
import Geocoder from 'react-native-geocoder';
import {pure} from 'recompose'

import styles from './screens/potentials/styles'
import colors from '../utils/colors'
import {GOOGLE_MAPS_API_KEY} from '../../config'
Geocoder.fallbackToGoogle(GOOGLE_MAPS_API_KEY);


// @pure
export default class CityState extends Component{

  constructor(props){
    super()

    this.state = {
      cityState: props.cityState && typeof props.cityState == 'object' ? props.cityState.cityState || `${props.cityState.locality}, ${props.cityState.adminArea}` : props.cityState
    }
  }

  componentDidMount(){
    if(!this.props.cityState || this.props.cityState == ''){
      this.geocode()
    }

  }

  async geocode(){
    if(this.props.coords.lat && this.props.coords.lng){
      try{
        const g = await Geocoder.geocodePosition(this.props.coords);
        __DEV__ && console.log(g);
        if(g && g[0]){
          this.setState({g, cityState: `${g[0].locality}, ${g[0].adminArea}`})
          this.props.cacheCity({
            type:'CACHE_CITY',
            payload: {
              userId: this.props.userId,
              coords: this.props.coords,
              cityState:`${g[0].locality}, ${g[0].adminArea}`
            }
          })
        }
      }catch(err){
        __DEV__ && console.log('geocode err', err);
        setTimeout(()=>{this.geocode()},parseInt(Math.random(30)*5000 + 5000))
      }
    }
  }

  render(){
    const cS = (this.state.cityState && (typeof this.state.cityState == 'string' && this.state.cityState.indexOf('null') > -1) ? this.props.cityState : this.state.cityState || this.props.cityState)
    return (
      <View style={{backgroundColor: 'transparent', height: 30}}>
        <Text
          style={[
            styles.cardBottomOtherText,
            {
              alignSelf: 'flex-start',
              color: this.props.color ? this.props.color : this.props.profileVisible ? '#fff' : colors.rollingStone
            },
            this.props.cityStateStyle || {}
          ]}
          key={`${this.props.potential.user.id}-matchn`}
        >{
          cS ? `${cS}`.replace(', null','').replace('null','') : ''
        }</Text>
      </View>
    )
  }
}
