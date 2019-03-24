import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, PixelRatio, Dimensions, StatusBar, Platform } from 'react-native';
import React from 'react';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import { MagicNumbers } from '../utils/DeviceConfig'
import { connect } from 'react-redux'
import CityState from './CityState'
import Card from './screens/potentials/NewerCard'
import UserDetails from './UserDetails';
import colors from '../utils/colors';
import VerifiedCoupleBadge from './Badge/VerifiedCoupleBadge'
import ActionMan from '../actions'
import {BlurView} from 'react-native-blur'
import PropTypes from 'prop-types';

const iOS = Platform.OS == 'ios';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const CardLabel = props => (
  <View>
    <Text
      style={[styles.cardBottomText, { color: props.textColor }]}
      key={`${props.potential.user.id}-names`}
    >{ props.matchName }
    </Text>

    <CityState
      cityState={props.city}
      potential={props.potential}
      coords={{lat: props.potential.user.latitude, lng: props.potential.user.longitude}}
    />
  </View>
);

@withNavigation
class UserProfile extends React.Component {

  static route = {
    styles: NavigationStyles.Fade,
    navigationBar: {
      visible: false
    }
  };

  static defaultProps = {
    cardWidth: DeviceWidth
  };

  constructor(props) {
    super(props)

    this.state = { slideIndex: 0, }
  }

  componentDidMount() {
    // dismissKeyboard()
  }

  onLayout(e) {
    const { layout } = e.nativeEvent

    if(!this.state.contentHeight) {
      this.handleSize(layout.height + 600)
    }
  }

  reportModal() {
    const them = [this.props.potential.user];
    if(this.props.potential.partner && this.props.potential.partner.gender){
      them.push(this.props.potential.partner)
    }
    this.props.dispatch(ActionMan.showInModal({
      component: 'ReportModal',
      passProps: {
        potential: this.props.potential,
      }
    }))
  }

  handleSize(contentHeight) {
    this.setState({ contentHeight })
  }
  render() {
    const { potential } = this.props,
      distance = potential.user.distance || 0,
      city = potential.user.city_state || '';
    const name = potential.user.firstname || '';
    const profileVisible = true;

    const isTopCard = true;
    const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : ''];

    if(potential.partner && potential.partner.gender) {
      names.push(potential.partner.firstname.trim());
    }
    const seperator = distance && city.length ? ' | ' : '';

    const heights = {
      smallest: {
        top: -60,
        second: -60,
        third: -55,
      },
      middle: {
        top: -65,
        second: -55,
        third: -50,
      },
      all: {
        top: -50,
        second: -50,
        third: -60,
      },
    };

    const heightTable = MagicNumbers.is4s ? heights.smallest : (MagicNumbers.is5orless ? heights.middle : heights.all);
    const cardHeight = DeviceHeight + (isTopCard ? heightTable.top : heightTable.second);
    const cardWidth = DeviceWidth;


    let matchName = `${names[0]} (${potential.user.age})`;

    if(potential.partner && potential.partner.firstname) {
      matchName = `${matchName} ${potential.partner.firstname == '+1' ? '' : '&'} ${names[1]}${potential.partner.firstname == '+1' ? '' : ` (${potential.partner.age})`}`;
    }

    const hasPartner = potential.partner && potential.partner.gender;
    const slideFrames = hasPartner && potential.partner.image_url && potential.partner.image_url != '' ? [potential.user, potential.partner] : [potential.user];
    const verifiedCouple = hasPartner && potential.couple.verified;


    return (
      <View style={{
        backgroundColor: 'black',
      }}>
        <Card {...this.props} profileVisible={true} spacedTop={true} matchName={matchName} isBrowse={true}/>
      </View>

    );


    // )
  }
}

class CustomTabBar extends React.Component {
  static propTypes: {
      goToPage: PropTypes.func,
      activeTab: PropTypes.object,
      tabs: PropTypes.array,
      pageNumber:PropTypes.number

    };

  renderTabOption(name, page) {
    const isTabActive = this.props.pageNumber === page;
    return (
      <TouchableOpacity key={`${name + page} ${isTabActive}`} onPress={() => this.props.goToPage(page)}>
        <View style={[styles.tab]}>
          <Text style={{ fontFamily: 'montserrat', fontSize: 16, color: isTabActive ? colors.white : colors.shuttleGray }}>{name.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const numberOfTabs = this.props.tabs.length;
    const w = MagicNumbers.screenWidth / numberOfTabs;

    const tabUnderlineStyle = {
      position: 'absolute',
      width: MagicNumbers.screenWidth / 2,
      height: 2,
      backgroundColor: colors.mediumPurple,
      bottom: 0,
      left: 0,
      transform: [
        { translateX: this.props.activeTab ? this.props.activeTab.interpolate({
          inputRange: this.props.tabs.map((c, i) => (w * i)),
          outputRange: [0, w]
        }) : 0
            }]
    };

    return (
      <View style={[styles.tabs, { marginHorizontal: MagicNumbers.screenPadding / 2 }]}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <Animated.View style={tabUnderlineStyle} />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
})

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)

const styles = StyleSheet.create({

  shadowCard: {
    shadowColor: colors.darkShadow,
    shadowRadius: 5,
    shadowOpacity: 50,
    shadowOffset: {
      width: 0,
      height: 5
    }
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: DeviceWidth,

  },
  singleTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: MagicNumbers.screenPadding / 2,
    width: MagicNumbers.screenWidth,

  },
  tabs: {
    height: 60,
    flexDirection: 'row',
    marginTop: 0,
    borderWidth: 1,
    width: DeviceWidth,
    flex: 1,
    marginHorizontal: 0,
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.shuttleGray,
  },
  animatedIcon: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    top: (DeviceHeight / 2) - 80,
    left: (DeviceWidth / 2) - 50,
    position: 'absolute',
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
    top: 50
  },
  absoluteText: {
    position: 'absolute',
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: 20
  },
  absoluteTextTop: {
    top: 0
  },
  absoluteTextBottom: {
    bottom: 0
  },
  basicCard: {
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'rgba(0,0,0,.2)',
    overflow: 'hidden',

  },
  bottomButtons: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    top: -40,
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    width: undefined
  },
  topButton: {
    height: 80,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,.2)',
    overflow: 'hidden'

  },

  closeProfile: {
    position: 'absolute',
    top: 10,
    left: 5,
    width: 50,

    backgroundColor: 'transparent',

    height: 50,
    alignSelf: 'center',

    overflow: 'hidden',

    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 25
  },
  dashedBorderImage: {
    marginHorizontal: 0,
    marginTop: 65,
    marginBottom: 20,
    padding: 0,
    width: DeviceWidth,
    height: DeviceHeight - 100,
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagebg: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 0,
    alignItems: 'stretch',
    flexDirection: 'column',
    width: DeviceWidth,
    height: DeviceHeight,

  },

  dot: {
    backgroundColor: 'transparent',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,

    borderColor: colors.white
  },
  activeDot: {
    backgroundColor: colors.mediumPurple20,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: colors.mediumPurple
  },
  wrapper: {

  },
  scrollSection: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    alignItems: 'center',
    flexDirection: 'column'
  },
  circleimage: {
    backgroundColor: colors.shuttleGray,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: colors.white,
    borderWidth: 3
  },
  cardStackContainer: {
    width: DeviceWidth,
    height: DeviceHeight,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'transparent'
  },

  cardBottomText: {
    marginLeft: 0,
    fontFamily: 'montserrat', fontWeight: '800',
    color: colors.shuttleGray,
    fontSize: 18,
    marginTop: 0
  },
  cardBottomOtherText: {
    marginLeft: 0,
    fontFamily: 'omnes',
    color: colors.rollingStone,
    fontSize: 16,
    marginTop: 10,
    opacity: 0.9
  }
});
