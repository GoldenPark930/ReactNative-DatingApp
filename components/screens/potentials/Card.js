import { Dimensions } from 'react-native';
import React from 'react';
import NewCard from './NewerCard';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth  = Dimensions.get('window').width;

class Card extends React.Component {

  static defaultProps = {
    profileVisible: false,
  };

  constructor(props) {
    super();
    this.state = {
      slideIndex: 0,
    };
  }
  getScrollResponder() {
    return this.refs.scrollbox;
  }
  getInnerViewNode(): any {
    return this.getScrollResponder().getInnerViewNode();
  }

  scrollTo({ destY, destX }) {
    this.getScrollResponder().scrollTo({ y: destY, x: destX }, true);
  }

  scrollWithoutAnimationTo(destY?: number, destX?: number) {
    this.getScrollResponder().scrollWithoutAnimationTo(destY, destX);
  }

  setNativeProps(np) {
    const incard = this.refs.incard;
    incard.setNativeProps(np);
  }

  openProfileFromImage(e, scroll) {
    if(this.props.profileVisible) {
      this.props.dispatch({ type: 'CLOSE_PROFILE' });
    }else{
      this.props.dispatch({ type: 'OPEN_PROFILE' });
    }
  }

  closeProfile() {
    this.props.dispatch({ type: 'CLOSE_PROFILE' });
  }

  render() {
    const potential = this.props.potential || { user: {} };
    const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : null];

    if (potential.partner && potential.partner.id && potential.partner.firstname) {
      names.push(potential.partner.firstname.trim());
    }

    const { pan }   = this.props;
    let   matchName = names[0];
    let   distance  = potential.user.distance   || 0;
    const city      = potential.user.city_state || '';
    const partnerDistance = potential.partner ? potential.partner.distance : 0;
    if(potential.partner && potential.partner.firstname) {
      matchName = `${matchName} & ${names[1]}`;
      distance = Math.min(distance, partnerDistance || 0);
    }
    const seperator = distance && city.length ? ' | ' : '';
    const cardHeight = DeviceHeight-60;
    const cardWidth = DeviceWidth;

    return (
      <NewCard
        profileVisible={this.props.profileVisible}
        key={`${potential.user.id}insidecard`}
        cardWidth={this.props.profileVisible ? DeviceWidth : cardWidth}
        cardHeight={cardHeight}
        seperator={seperator}
        city={city}
        potential={potential}
        pan={pan}
        dispatch={this.props.dispatch}
        activeIndex={this.state.activeIndex}
        user={this.props.user}
        isTopCard={this.props.isTopCard}
        matchName={matchName}
        distance={parseInt(distance)}
        closeProfile={this.closeProfile.bind(this)}
        openProfileFromImage={this.openProfileFromImage.bind(this, true)}
      />
    )
  }
}

export default Card;
