import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native'
import TimerMixin from 'react-timer-mixin'
import colors from '../../utils/colors'

const { width, height } = Dimensions.get('window')

/**
 * Default styles
 * @type {StyleSheetPropType}
 */
const styles = StyleSheet.create({
  grayDot: {
    backgroundColor: colors.shuttleGray,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    borderColor: colors.shuttleGray
  },
  dot15: {
    backgroundColor: 'transparent',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: colors.white
  },
  activeDot15: {
    borderColor: colors.mediumPurple,
    backgroundColor: colors.mediumPurple,

  },

  activeDot16: {
    backgroundColor: colors.mediumPurple,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: colors.mediumPurple
  },
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
  },

  wrapper: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center', borderRadius: 11,

  },

  slide: {
    backgroundColor: 'transparent',
    borderRadius: 11,

  },

  pagination_x: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  pagination_y: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
})

const Swiper = React.createClass({


  mixins: [TimerMixin],

  /**
   * Default props
   * @return {object} props
   * @see http://facebook.github.io/react-native/docs/scrollview.html
   */
  getDefaultProps() {
    return {
      horizontal: true,
      pagingEnabled: true,
      showsHorizontalScrollIndicator: false,
      showsVerticalScrollIndicator: false,
      bounces: false,
      scrollsToTop: false,
      removeClippedSubviews: true,
      automaticallyAdjustContentInsets: false,
      showsPagination: true,
      showsButtons: false,
      loop: true,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplayDirection: true,
      index: 0,
    }
  },

  /**
   * Init states
   * @return {object} states
   */
  getInitialState() {
    const props = this.props

    const initState = {
      isScrolling: false,
      scroll: new Animated.Value(0),
      autoplayEnd: false,
    }

    initState.total = props.children ? (React.Children.count(props.children)) : 0

    initState.index = initState.total > 1 ? props.index || 1 : 0

    // Default: horizontal
    initState.dir = props.horizontal == false ? 'y' : 'x'
    initState.width = props.width || width
    initState.height = props.height || height
    initState.offset = {}

    if (initState.total > 1) {
      const setup = props.loop ? 1 : initState.index
      initState.offset[initState.dir] = initState.dir == 'y' ? initState.height * setup : initState.width * setup
    }

    return initState
  },


  // componentWillMount() {
  // },

  componentDidMount() {
    if(this.props.autoplay){this.autoplay()}

  },

    /**
   * Scroll begin handle
   * @param  {object} e native event
   */
  onScrollBegin(e) {
    // update scroll state

    this.props.onScrollBeginDrag && this.setImmediate(() => {
      this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e, this.state, this)
    })
  },

  /**
   * Scroll end handle
   * @param  {object} e native event
   */
  onScrollEnd(e) {
    // update scroll state

    this.updateIndex(e.nativeEvent.contentOffset, this.state.dir)

    // if `onMomentumScrollEnd` registered will be called here
    // Note: `this.setState` is async, so I call the `onMomentumScrollEnd`
    // in setTimeout to ensure synchronous update `index`
    this.props.onMomentumScrollEnd && this.setImmediate(() => {
      this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e, this.state, this)
    })
  },

  /**
   * Update index after scroll
   * @param  {object} offset content offset
   * @param  {string} dir    'x' || 'y'
   */
  updateIndex(offset, dir) {
    const index = this.state.index+1

    this.setState({
      index,
    })
  },

  autoplay(){
    if(this.props.autoplay){
      this.scrollTo((this.state.index+1) );
      this.setState({index:this.state.index+1})
      this.setTimeout(() => {
        this.autoplay()
      }, this.props.autoplayTimeout)
    }
  },

  /**
   * Scroll by index
   * @param  {number} index offset index
   */
  scrollTo(index) {
    // if (this.state.isScrolling) return
    const {width,height,dir,total} = this.state
    const x = (dir == 'x') ? ((index%total) * width) : 0;
    const y = (dir == 'y') ? ((index%total) * height) : 0;
    this.refs.scrollView && this.refs.scrollView.scrollTo({y, x, animated: true})

  },

  /**
   * Render pagination
   * @return {object} react-dom
   */
  renderPagination() {
    // By default, dots only show when `total` > 2
    if (React.Children.count(this.props.children) <= 1 || this.props.inCard && !this.props.profileVisible) return null

    return (
      <View style={[{position:'absolute',top:0,right:0},this.props.paginationBoxStyle]}>
        {React.Children.map(this.props.children, (c, i) => {
          return (
            <View
              pointerEvents={'box-none'}
              style={[styles[`pagination_${this.state.dir}`], this.props.paginationStyle]}
            >
              <View style={this.props.grayDots ? styles.grayDot : styles.dot} key={`dot${i}`} />
            </View>
          )
        })}


      </View>
    )
  },

  //
  componentWillReceiveProps(nProps){
    if(!this.props.autoplay && nProps.autoplay && React.Children.count(this.props.children) > 1 ){this.autoplay()}

    if(nProps.index != this.state.index){
      this.scrollTo(nProps.index);
    }
  },

  /**
   * Default render
   * @return {object} react-dom
   */
  render() {
    const state = this.state
    const props = this.props
    const children = props.children
    const index = state.index
    const total = state.total
    const loop = props.loop
    const dir = state.dir
    const key = 0


    const pageStyle = [{width: state.width, height: state.height}, styles.slide]


    const pages = total > 1 ?
      Object.keys(children).map((p, i) => <View style={pageStyle} key={`${i}sp`}>{children[p]}</View>) :
        (<View style={pageStyle} key={'xslidepot'}>{children}</View>);


    // For the WELCOME slider
    let inputRange = [0, 0, width, width * 2, width * 3, width * 4, width * 5, width * 6],
      outputRange = [-64, 64, -64, -32, 0, 32, 64, -64];

    let inputRangeVertical = [0, height, height * 2, height * 3],
      outputRangeVertical = [0, 27, 0, 27];


    return (
      <Animated.View
        pointerEvents={'box-none'}
        style={[styles.container, {
          alignItems: 'center',
          justifyContent: 'center',
          width: props.width,
          height: props.height,
          position:'relative',
          zIndex:9999,
          borderRadius: 11,
          top:0,
          opacity: this.props.pan && this.props.pan.interpolate ? this.props.pan.interpolate({
            inputRange: [-300, -10, 0, 10, 300],
            outputRange: [0.3, 1, 1, 1, 0.3]
          }) : 1,
        }]}
      >
        <ScrollView
          ref={`scrollView`}
          pagingEnabled
          scrollEnabled={this.props.scrollEnabled}
          horizontal
          onStartShouldSetResponderCapture={(e,x) => true}
          onMoveShouldSetResponderCapture={(e,x) => true}
          onStartShouldSetResponder={(e,x) => true}
          onMoveShouldSetResponder={(e,x) => true}
          contentContainerStyle={[styles.wrapper, props && props.style, {
            borderRadius: 11,
            top:0,

          }]}
          style={{
            borderRadius: 11,
            top:0,

          }}
          scrollEventThrottle={this.props.autoplayTimeout}
          onScroll={this.onScrollBegin}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScrollAnimationEnd={this.onScrollEnd}
        >
          {pages}
        </ScrollView>

      {this.props.autoplay &&  <View pointerEvents={'box-none'} style={[styles[`pagination_${this.state.dir}`], props.paginationStyle, {backgroundColor: 'transparent',position:'absolute',top:-300,right:-300}]}>
          {(props.showsPagination && !props.inCard) || (props.inCard && props.profileVisible) ? React.Children.map(props.children, (c, i) => {
            return (<View
              style={[(props.grayDots ? styles.grayDot : styles.dot15),
                  (index%total == i ? props.grayDots ? styles.activeDot16 : styles.activeDot15 : null)]}
              key={`swiperdot${i}`}
            />)
          }) : <View/>}
        </View>}
      </Animated.View>
    )
  }
})
export default Swiper
