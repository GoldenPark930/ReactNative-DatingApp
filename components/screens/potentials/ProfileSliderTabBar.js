import React from 'react';
import {Text, View, TouchableOpacity, Dimensions, Animated, Easing} from 'react-native';
import {connect} from 'react-redux'
import ActionMan from '../../../actions/'
import styles from './styles'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import colors from '../../../utils/colors';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class SliderTabBar extends React.Component{
  static defaultProps= {
    onPressTab: () => {

    },
    width: DeviceWidth - 40,
    height: DeviceHeight
  };

  constructor(props){
    super()
    this.state = {
      slider: new Animated.Value(props.potentialsPage),
      tab: 0
    }
  }
  componentWillReceiveProps(nProps){
  }
  togglePage(t){


    this.props.goToPage(t)
  }
  renderTabOption(name, page) {
    const isTabActive = this.props.pageNumber === page;
    return (
      <TouchableOpacity
        key={name + page}
        style={{
          zIndex: 700,
          width: this.props.width / 2,
        }}
        onPress={() => {
          if(!isTabActive){
            this.togglePage(page)
          }
        }}
      >
        <View style={[styles.tab,]}>
          <Text
            style={{
              fontFamily: 'montserrat',
              fontSize: 14,
              color: isTabActive ? colors.white : colors.shuttleGray}}
          >{
              name.toUpperCase()
            }</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const w = this.props.width / 2;

    const tabUnderlineStyle = {
      position: 'absolute',
      width: this.props.width / 2,
      height: 2,
      backgroundColor: colors.mediumPurple,
      bottom: 0,
      left: 0,
      transform: [
        {translateX: this.props.activeTab
      }]
    };

    return (
      <View style={[styles.tabs,{marginBottom:20}]}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <Animated.View style={tabUnderlineStyle} ref={'TAB_UNDERLINE_REF'} />
      </View>
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  potentialsPage: state.ui.potentialsPage,
})


const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(SliderTabBar);
