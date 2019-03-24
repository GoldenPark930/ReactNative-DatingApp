'use strict';

import React from "react";
import PropTypes from 'prop-types';
import {StyleSheet, View, ScrollView, Animated, Dimensions} from "react-native";
import {VibrancyView} from 'react-native-blur';
const screen = Dimensions.get('window');
const ScrollViewPropTypes = ScrollView.propTypes;

import colors from '../../utils/colors'


class ParallaxView extends React.Component{

    static propTypes = {
        ...ScrollViewPropTypes,
        windowHeight: PropTypes.number,
        header: PropTypes.node,
        blur: PropTypes.string,
        contentInset: PropTypes.object,
    };

    static getDefaultProps = {
      windowHeight: 300,
      contentInset: {
          // top: -20 * screen.scale
      }
    };

    constructor(props){
      super();
      this.state = {
          scrollY: new Animated.Value(0)
      };
    }

    /**
     * IMPORTANT: You must return the scroll responder of the underlying
     * scrollable component from getScrollResponder() when using ScrollableMixin.
     */
    getScrollResponder() {
      return this._scrollView.getScrollResponder();
    }

    setNativeProps(props) {
      this._scrollView.setNativeProps(props);
    }

    renderBackground() {
        var { windowHeight, backgroundSource, blur } = this.props;
        var { scrollY } = this.state;
        if (!windowHeight || !backgroundSource) {
            return null;
        }
        return (
            <Animated.Image
                style={[styles.background, {
                    height: windowHeight,
                    transform: [{
                        translateY: scrollY.interpolate({
                            inputRange: [ -windowHeight, 0, windowHeight ],
                            outputRange: [ windowHeight / 2, 0, -windowHeight / 3 ]
                        })
                    },{
                        scale: scrollY.interpolate({
                            inputRange: [ -windowHeight, 0, windowHeight],
                            outputRange: [2, 1, 1]
                        })
                    }]
                }]}
                source={backgroundSource}>
                {
                    <View  style={styles.blur} />
                }
            </Animated.Image>
        );
    }

    renderHeader() {
        let { windowHeight, backgroundSource } = this.props;
        let { scrollY } = this.state;
        if (!windowHeight || !backgroundSource) {
            return null;
        }
        return (
            <Animated.View style={{
                position: 'relative',
                height: windowHeight,
                opacity: scrollY.interpolate({
                    inputRange: [ -windowHeight, 0, windowHeight / 1.2],
                    outputRange: [1, 1, 0]
                }),
            }}>
                {this.props.header}
            </Animated.View>
        );
    }

    render() {
        let { style, ...props } = this.props;
        return (
            <View style={[styles.container, style]}>
                {this.renderBackground()}
                <ScrollView
                    {...props}
                    style={styles.scrollView}
                    ref={component => { this._scrollView = component; }}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}]
                    )}
                    scrollEventThrottle={16}>
                    {this.renderHeader()}
                        {this.props.children}

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: 'transparent',flex:1,zIndex:999
    },
    background: {
        position: 'absolute',
        // backgroundColor: '#2e2f31',
        width: screen.width,
        resizeMode: 'cover'
    },
    blur: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: colors.outerSpace,
        opacity:0.9
    },
    content: {
        shadowColor: '#222',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        backgroundColor: colors.outerSpace,
        flex: 1,
        flexDirection: 'column'
    }
});

export default ParallaxView;
