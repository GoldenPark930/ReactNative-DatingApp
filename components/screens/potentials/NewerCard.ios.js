import React from 'react'
import { Text, View, StatusBar, ScrollView, Image, Animated, TouchableOpacity, Dimensions } from 'react-native'
import ActionMan from '../../../actions'
import styles from './styles'
import { MagicNumbers } from '../../../utils/DeviceConfig'
import colors from '../../../utils/colors'
import UserDetails from '../../UserDetails'
import VerifiedCoupleBadge from '../../Badge/VerifiedCoupleBadge'
import {pure, onlyUpdateForKeys} from 'recompose'
import CityState from '../../CityState'
import CardLabel from '../../CardLabel'
import ApproveIcon from './ApproveIcon'
import DenyIcon from './DenyIcon'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

@pure
class NewerCard extends React.Component {
  constructor(props){
    super()
    this.state = {
      size: { width: props.cardWidth, height: props.cardHeight },
    };
  }


  reportModal() {
    const {potential} = this.props;

    this.props.dispatch(ActionMan.showInModal({
      component: 'ReportModal',
      passProps: {
        action: 'report',
        potential
      }
    }))
  }

  renderProfileVisible(){

    const {profileVisible, cardWidth, city, seperator, potential, isTopCard, matchName, distance} = this.props;

    const hasPartner = (potential.partner && potential.partner.firstname ? true : false);
    const verifiedCouple = hasPartner && potential.partner.partner_id;

    return (
      <View
        key={`outer${potential.user.id}`}
        style={{backgroundColor: '#000', width: DeviceWidth, top: 0,flexGrow:1 }}
      >


        <ScrollView
          scrollEnabled
          key={`scrollouter${potential.user.id}`}
          style={{flexGrow:1}}
        >
          <Header
            {...this.props}
            carouselImgLoaded={this.state.carouselImgLoaded}
            showCloseProfile
            closeProfile={() => (this.props.toggleProfile ? this.props.toggleProfile() : this.props.navigator.pop())}
            cardWidth={DeviceWidth}
            cardHeight={DeviceHeight}
          />

          <View
            key={`cardlabel${potential.user.id}`}

            style={{
              flexGrow: 1,
              backgroundColor: colors.outerSpace,
              alignItems: 'flex-start',
              alignSelf: 'flex-start',
              paddingBottom: 100,
              top: 0
            }}

          >


            <View
              key={`blurkey${potential.user.id}`}
              style={{
                flexGrow: 1
              }}
            >

              <View style={{ paddingVertical: 20, width: DeviceWidth, flexGrow: 10, marginTop: 0,paddingBottom:200}}>

                <View style={{marginHorizontal: MagicNumbers.screenPadding / 2, marginBottom: 20}}>
                  <CardLabel
                    showDistance={!this.props.isBrowse}
                    cacheCity={this.props.dispatch}
                    potential={potential}
                    seperator={seperator}
                    matchName={matchName}
                    city={city}
                    distance={distance}
                    textColor={colors.white}
                  />
                  {verifiedCouple &&
                    <VerifiedCoupleBadge
                      placementStyle={{position: 'relative', alignSelf: 'flex-start', left: 0, top: 0, marginTop: 20}}
                    />
                  }

                </View>

                {potential.user.bio && potential.user.bio.length ?
                  <View style={{ margin: MagicNumbers.screenPadding / 2, width: MagicNumbers.screenWidth, flexDirection: 'column' }}>
                    <Text
                      style={[styles.cardBottomOtherText, {
                        color: colors.white,
                        marginBottom: 15,
                        marginLeft: 0
                      }]}
                    >{ !hasPartner ? 'Looking for' : 'Looking for' }</Text>
                    <Text
                      style={{
                        color: colors.white,
                        fontFamily: 'omnes',
                        fontSize: 18,
                        marginBottom: 15
                      }}
                    >{ potential.user.bio }</Text>
                  </View> : null }

                {hasPartner && potential.partner.bio && potential.partner.bio.length ?
                  <View
                    style={{
                      margin: MagicNumbers.screenPadding / 2,
                      width: MagicNumbers.screenWidth
                    }}
                  >
                    <Text style={{ fontFamily: 'omnes', color: colors.white, fontSize: 18, marginBottom: 15 }}>
                      {potential.partner.bio}
                    </Text>
                  </View> : null
                }

                <UserDetails
                  potential={potential}
                  user={this.props.user}
                  location={'card'}
                />

                <TouchableOpacity
                  onPress={this.reportModal.bind(this)}
                >
                  <View
                    style={{ marginTop: 20, paddingBottom: 50 }}
                  >
                    <Text
                      style={{
                        fontFamily: 'omnes',
                        color: colors.mandy,
                        textAlign: 'center'
                      }}
                    >Report or Block this user</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    height: 50,
                    zIndex: 9999,
                    alignItems: 'center',
                    width: 50,
                    justifyContent: 'center',
                    flex: 0,
                    alignSelf: 'center',
                  }}
                  hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
                  onPress={() => (this.props.toggleProfile ? this.props.toggleProfile() : this.props.navigator.pop())}
                >
                  <Image
                    resizeMode={Image.resizeMode.contain}
                    style={{ height: 12, width: 12, marginTop: 10 }}
                    source={require('./assets/close@3x.png')}

                  />
                </TouchableOpacity>


              </View>

            </View>

          </View>
        </ScrollView>
      </View>


    )
  }
  renderClosed(){
    const {potential} = this.props;

    return (
      <View key={`outer${potential.user.id}`} pointerEvents={'box-none'} style={{flexGrow: 1}} >


        <ScrollView
          contentOffset={{x: 0, y: 0}}
          scrollEnabled={false}
          key={`scrollouter${potential.user.id}`}
        >
          <Header
            {...this.props}
            carouselImgLoaded={this.state.carouselImgLoaded}
            closeProfile={() => {
              this.props.closeProfile ? this.props.closeProfile() : this.props.navigator.pop()
            }}
          />

        </ScrollView>

      </View>
    )
  }
  render() {
    const {profileVisible, cardWidth, city, seperator, potential, cardHeight, matchName, distance} = this.props;
    const hasPartner = (potential.partner && potential.partner.firstname ? true : false);
    const verifiedCouple = hasPartner && potential.partner.partner_id ? true : false;

    return (
      <View
        style={{
          flexGrow: 1,
          borderRadius: 12,
          top: profileVisible && !this.props.spacedTop ? -60 : 0,

        }}
        pointerEvents={'box-none'}


      >
        <StatusBar
          hidden={profileVisible}
          animated
          barStyle="default"
          translucent
          showHideTransition={'slide'}
        />

        <View
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative'

          }}
          pointerEvents={'box-none'}
        >
          {profileVisible ? (
            <TouchableOpacity
              style={{
                zIndex: 9999,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 0,
                top: 10,
                left: 10,
                paddingVertical: 14,
                paddingHorizontal: 12,
                position: 'absolute'
              }}
              hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
              onPress={() => (this.props.toggleProfile ? this.props.toggleProfile() : this.props.navigator.pop())}

            >
              <Image
                pointerEvents={'none'}
                resizeMode={Image.resizeMode.contain}
                style={{
                  height: 15,
                  width: 15,
                  marginTop: 0,
                }}
                source={require('./assets/close@3x.png')}
              />
            </TouchableOpacity>
          ) : null}

          {/* <Image
            source={potential.user.image_url ? {uri: potential.user.image_url } : require('./assets/defaultuser.png')}
            style={{
              height: profileVisible ? DeviceHeight : this.props.cardHeight,
              width: this.props.cardWidth,
              position: 'absolute',
              top: 0,
              opacity: 1,
              backgroundColor: colors.shuttleGray,
            }}
            pointerEvents="none"
            resizeMode="cover"
            key={`cardbg${potential.user.id}img`}

          /> */}
          {profileVisible ? this.renderProfileVisible() : this.renderClosed()}
        </View>
        <View
          key={`cardlabell${potential.user.id}`}
          pointerEvents={'box-none'}
          style={{
              height:  100,
              flexGrow: 10,
              zIndex:profileVisible ? 0 : 800,
              overflow: 'hidden',
              top: profileVisible ? cardHeight-10 : -10,
              width: cardWidth,
              backgroundColor: colors.white,
              borderBottomLeftRadius: 11,
              borderBottomRightRadius: 11,
          }}
        >
          <View
            style={{
                borderBottomLeftRadius: 11,
                borderBottomRightRadius: 11,
                padding: 20,
                height: 100,
            }}
            key={`blurkeyl${potential.user.id}`}

          >
            <CardLabel
              showDistance={!this.props.isBrowse}
              cacheCity={this.props.dispatch}
              potential={potential}
              hideCityState={!this.props.isBrowse}
              seperator={seperator}
              matchName={matchName}
              city={city}
              distance={distance}
              textColor={colors.shuttleGray}
            />
            {verifiedCouple && (
              <VerifiedCoupleBadge
                placementStyle={{
                    position: 'absolute',
                    alignSelf: 'flex-start',
                    right: 15,
                    top: 63
                }}
              />
            )}
          </View>
        </View>


        {this.props.isTopCard ? <DenyIcon pan={this.props.pan} /> : null}
        {this.props.isTopCard ? <ApproveIcon pan={this.props.pan} /> : null}

      </View>
    )
  }
}


class Header extends React.Component{
  state = {
    active: 0
  };

  render(){
    const { potential, imgLoadedCallback, carouselImgLoaded, showCloseProfile} = this.props

    return (
      <View
        style={{
          flexGrow: 1,
          backgroundColor: '#000',
          borderTopLeftRadius: 11,
          overflow: 'hidden',
          borderTopRightRadius: 11,

        }}
      >

        {(potential.partner && potential.partner.id != 'NONE' ? (


          <ScrollView
            horizontal

            snapToInterval={DeviceWidth}
            onScroll={e => {
              __DEV__ && console.log(e)
            }}
            scrollEnabled={showCloseProfile}
            pagingEnabled

            style={[{
                flexGrow: 1,
                backgroundColor: 'transparent',
                zIndex: carouselImgLoaded ? 1 : -1,
                height: this.props.cardHeight - 80,
                width: this.props.cardWidth
            }]}

          >
            {(potential.partner && potential.partner.id != 'NONE' ? [potential.user, potential.partner] : [potential.user]).map((slide, i) => (
              <View
                key={`vcard${potential.user.id}img${i == 1 ? 'partner' : ''}`}

                style={[{
                    height: this.props.cardHeight - 80,
                    width: this.props.cardWidth,
                    flexGrow: 1,
                }]}
              >
                <Image
                  key={`card${potential.user.id}img${i == 1 ? 'partner' : ''}`}

                  style={[{
                      height: this.props.cardHeight - 80,
                      width: this.props.cardWidth,
                      backgroundColor: slide.image_url ? 'transparent' : '#fff'
                  }]}
                  onLoad={imgLoadedCallback}
                  resizeMode={Image.resizeMode.cover}
                  source={slide.image_url ? {uri: slide.image_url } : require('./assets/defaultuser.png')}
                />
              </View>
            ))}
          </ScrollView>


        ) : (
          <View
            style={{
                height: this.props.cardHeight - 80,
                width: this.props.cardWidth,
                flexGrow: 1,
                backgroundColor: 'transparent',
                zIndex: carouselImgLoaded ? 1 : -1,


            }}
          >
            <Image
              key={`card${potential.user.id}img`}
              style={{
                height: this.props.cardHeight - 80,
                width: this.props.cardWidth,
                flexGrow: 1,

              }}
              onLoad={imgLoadedCallback}

              resizeMode={Image.resizeMode.cover}
              source={potential.user.image_url ? {uri: potential.user.image_url } : require('./assets/defaultuser.png')}
            />
          </View>

        ))}

      </View>
        )
          }
}

export default NewerCard;
