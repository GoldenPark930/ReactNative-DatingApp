const React = require('react');
const {
  StyleSheet,
  Text,
  View, Dimensions,
  TouchableOpacity,
} = require('react-native');
import PropTypes from 'prop-types';


const deviceWidth = Dimensions.get('window').width;

const TAB_UNDERLINE_REF = 'TAB_UNDERLINE';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },

  tabs: {
    height: 50,
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#ccc',
  },
});

const CustomTabBar = React.createClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
  },

  renderTabOption(name, page) {
    const isTabActive = this.props.activeTab === page;

    return (
      <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)}>
        <View style={[styles.tab]}>
          <Text style={{ color: isTabActive ? 'navy' : 'black', fontWeight: isTabActive ? 'bold' : 'normal' }}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  },

  setAnimationValue(value) {
    // this.refs[TAB_UNDERLINE_REF].setNativeProps(precomputeStyle({
    //   left: (deviceWidth * value) / this.props.tabs.length
    // }));
  },

  render() {
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: deviceWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <View style={tabUnderlineStyle} ref={TAB_UNDERLINE_REF} />
      </View>
    );
  },
});

export default CustomTabBar;
