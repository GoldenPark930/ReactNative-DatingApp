// forked from deep inside react native


'use strict';

import {Dimensions,PixelRatio} from 'react-native';
import buildStyleInterpolator from 'buildStyleInterpolator'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

//
//
// const FadeIn = {
//   opacity: {
//     from: 0,
//     to: 1,
//     min: 0.5,
//     max: 1,
//     type: 'linear',
//     extrapolate: false,
//     round: 100,
//   },
// };
//
// const FadeOut = {
//   opacity: {
//     from: 1,
//     to: 0,
//     min: 0,
//     max: 0.5,
//     type: 'linear',
//     extrapolate: false,
//     round: 100,
//   },
// };

const ToTheLeft = {
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: -Dimensions.get('window').width, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  opacity: {
    value: 1.0,
    type: 'constant',
  },

  translateX: {
    from: 0,
    to: -Dimensions.get('window').width,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
};



const ToTheRight = {
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: Dimensions.get('window').width, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },


  translateX: {
    from: 0,
    to: Dimensions.get('window').width,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
};


const FromTheRight = {
  opacity: {
    value: 1.0,
    type: 'constant',
  },

  transformTranslate: {
    from: {x: Dimensions.get('window').width, y: 0, z: 0},
    to: {x: 0, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },

  translateX: {
    from: Dimensions.get('window').width,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },

  scaleX: {
    value: 1,
    type: 'constant',
  },
  scaleY: {
    value: 1,
    type: 'constant',
  },
};

const FromTheLeft = {
  ...FromTheRight,
  transformTranslate: {
    from: {x: -SCREEN_WIDTH, y: 0, z: 0},
    to: {x: 0, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  translateX: {
    from: -SCREEN_WIDTH,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
};


const SlideToTheLeft = {
  // Rotate *requires* you to break out each individual component of
  // rotation (x, y, z, w)
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: -1, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  // Uncomment to try rotation:
  // Quick guide to reasoning about rotations:
  // http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-17-quaternions/#Quaternions
  // transformRotateRadians: {
  //   from: {x: 0, y: 0, z: 0, w: 1},
  //   to: {x: 0, y: 0, z: -0.47, w: 0.87},
  //   min: 0,
  //   max: 1,
  //   type: 'linear',
  //   extrapolate: true
  // },
  transformScale: {
    from: {x: 1, y: 1, z: 1},
    to: {x: 0.95, y: 0.95, z: 1},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true
  },
  opacity: {
    from: 1,
    to: 0.9,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100,
  },
  translateX: {
    from: 0,
    to: -1,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  scaleX: {
    from: 1,
    to: 0.95,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true
  },
  scaleY: {
    from: 1,
    to: 0.95,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true
  },
};




const FromTheFront = {
  // opacity: {
  //   value: 1.0,
  //   type: 'constant',
  // },
  opacity: {
    from: 0,
    to: 1,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: 100,
  },
  transformTranslate: {
    from: {x: 0, y: (Dimensions.get('window').height - 85), z: 0},
    to: {x: 0, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  // translateY: {
  //   from: Dimensions.get('window').height,
  //   to: 0,
  //   min: 0,
  //   max: 1,
  //   type: 'linear',
  //   extrapolate: true,
  //   round: PixelRatio.get(),
  // },
  scaleX: {
    value: 1,
    type: 'constant',
  },
  scaleY: {
    value: 1,
    type: 'constant',
  },
};

const ToTheBack = {
  // Rotate *requires* you to break out each individual component of
  // rotation (x, y, z, w)
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: 0, y: (-1*(Dimensions.get('window').height) + 75 ), z: 0}, //modiified for login
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  transformScale: {
    from: {x: 1, y: 1, z: 1},
    to: {x: 1, y: 1, z: 1},
    min: 1,
    max: 1,
    type: 'constant',
  },
  // opacity: {
  //   value: 1,
  //   type: 'constant',
  // },
  opacity: {
    from: 1,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100,
  },
  scaleX: {
    value: 1,
    type: 'constant',
  },
  scaleY: {
    value: 1,
    type: 'constant',
  },
};

const SPRING_FRICTION = 26,
    SPRING_TENSION = 200,
    GESTURE_DETECT_MOVEMENT = 2,
    NOT_MOVING = 0.5,
    DIRECTION_RATIO = 0.66,
    SNAP_VELOCITY = 2,
    EDGE_HIT_WIDTH = 40,
    STILL_COMPLETION_RATIO = (3/5);


const BaseOverswipeConfig = {
  frictionConstant: 1,
  frictionByDistance: 1.5,
};

const BaseLeftToRightGesture = {

  // If the gesture can end and restart during one continuous touch
  isDetachable: false,

  // How far the swipe must drag to start transitioning
  gestureDetectMovement: GESTURE_DETECT_MOVEMENT,

  // Amplitude of release velocity that is considered still
  notMoving: NOT_MOVING,

  // Fraction of directional move required.
  directionRatio: DIRECTION_RATIO,

  // Velocity to transition with when the gesture release was "not moving"
  snapVelocity: SNAP_VELOCITY,

  // Region that can trigger swipe. iOS default is 30px from the left edge
  edgeHitWidth: EDGE_HIT_WIDTH,

  // Ratio of gesture completion when non-velocity release will cause action
  stillCompletionRatio: STILL_COMPLETION_RATIO,

  fullDistance: SCREEN_WIDTH,

  direction: 'left-to-right',

};

const BaseRightToLeftGesture = {
  ...BaseLeftToRightGesture,
  direction: 'right-to-left',
};




const CustomSceneConfigs = {
  HorizontalSlide: {
    // Rebound spring parameters when transitioning FROM this scene
    springFriction: SPRING_FRICTION,
    springTension: SPRING_TENSION,

    // Velocity to start at when transitioning without gesture
    defaultTransitionVelocity: 1.5,

    gestures: {
      jumpBack: {
        ...BaseLeftToRightGesture,
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: EDGE_HIT_WIDTH,
        isDetachable: true,
      },
      jumpForward: {
        ...BaseRightToLeftGesture,
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: EDGE_HIT_WIDTH,
        isDetachable: true,
      },
    },
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheRight),
      out: buildStyleInterpolator(ToTheLeft),
    },
  },
  // For the welcome - auth screen transition
  VerticalSlide: {
    // Rebound spring parameters when transitioning FROM this scene
    springFriction: SPRING_FRICTION,
    springTension: SPRING_TENSION,

    // Velocity to start at when transitioning without gesture
    defaultTransitionVelocity: 1.5,

    gestures: {


      pop: {
        ...BaseLeftToRightGesture,
        edgeHitWidth: 150,
        direction: 'top-to-bottom',
        fullDistance: SCREEN_HEIGHT,
      },
      push: {
        ...BaseRightToLeftGesture,
        edgeHitWidth: 150,
        direction: 'top-to-bottom',
        fullDistance: SCREEN_HEIGHT,

      },
    },
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheFront),
      out: buildStyleInterpolator(ToTheBack),
    },

  },


  SlideInFromRight: {
    springFriction: SPRING_FRICTION,
    springTension: SPRING_TENSION,

    // Velocity to start at when transitioning without gesture
    defaultTransitionVelocity: 1.5,

    gestures: {

      jumpBack: {
        ...BaseLeftToRightGesture,
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: EDGE_HIT_WIDTH,
        isDetachable: true,
      },
      jumpForward: {
        ...BaseRightToLeftGesture,
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: EDGE_HIT_WIDTH,
        isDetachable: true,
      },
      pop: {
        ...BaseRightToLeftGesture,

        edgeHitWidth: 150,
        isDetachable: true,
        fullDistance: SCREEN_WIDTH,
      },
      push: {
        ...BaseLeftToRightGesture,

        edgeHitWidth: 150,
        isDetachable: true,
        fullDistance: SCREEN_WIDTH,

      },
    },
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheRight),
      out: buildStyleInterpolator(SlideToTheLeft),
    },


  }
};

export default CustomSceneConfigs;
