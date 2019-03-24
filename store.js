import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {AsyncStorage} from 'react-native'
import createActionBuffer from 'redux-action-buffer'
import throttleActions from 'redux-throttle-actions';
import promiseMiddleware from 'redux-promise-middleware';
import {createLogger} from 'redux-logger';
import {persistStore, autoRehydrate, } from 'redux-persist'
import {REHYDRATE} from 'redux-persist/constants'
import { composeWithDevTools } from 'redux-devtools-instrument'
import immutableTransform from 'redux-persist-transform-immutable'
import perflogger from 'redux-perf-middleware';

import { createNavigationEnabledStore } from '@exponent/ex-navigation'
import ActionMan from './actions/'
import createReducer from './reducers/';
import createPrefetcher from './rn-redux-image-prefetch'

const logger = createLogger({
  diff: true,
  level: 'debug',
  collapsed: true
});

const middlewares = [
  // perflogger,
  thunk,
  promiseMiddleware(),
  createActionBuffer(REHYDRATE),
  // throttleActions(['UPDATE_USER'], 2000, {leading: true, trailing: false }),
  // throttleActions(['EX_NAVIGATION.PUSH'], 700, {leading: true, trailing: false }),
  throttleActions(['OPEN_PROFILE', 'CLOSE_PROFILE'], 700, {leading: true, trailing: false }),
  throttleActions(['GET_POTENTIALS', 'GET_MESSAGES', 'GET_MATCHES'], 1000, {leading: true, trailing: false }),
  createPrefetcher({
    watchKeys: [
      {
        FETCH_POTENTIALS_FULFILLED: {
          key: 'matches',
          source: 'potentials',
          location: {
            user: {
              image_url: true
            }
          }
        }
      },
      // {
      //   FETCH_BROWSE_FULFILLED: {
      //     source: 'browse',
      //     location: {
      //       user: {
      //         image_url: true
      //       }
      //     }
      //   }
      // },
    ]
  }),
  // createPrefetcher({
  //   watchKeys: [
  //     {
  //       'FETCH_BROWSE_FULFILLED': {
  //         key: '',
  //         location: {
  //           user: {
  //           image_url: true
  //         }
  //       }
  //     }
  //   }
  //
  //   ]
  // })

]

function configureStore(initialState = ({})) {
  if(global.__DEV__) {
    const bak = global.XMLHttpRequest;
    const xhr = global.originalXMLHttpRequest ?
        global.originalXMLHttpRequest :
        global.XMLHttpRequest;

    global.XMLHttpRequest = xhr;
      //

    const comp = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionCreators: ActionMan,
      maxAge: 200,
    }) : compose

    const store = createNavigationEnabledStore(createStore)(
        createReducer(),
        comp(
          autoRehydrate({log: true}),
          applyMiddleware(...middlewares), //logger
        ),
      );

    const persistor = persistStore(store, {
      storage: AsyncStorage,
      blacklist: ['appNav', 'navigation', 'ui', 'potentials', 'browse'],
      transforms: [immutableTransform({
        whitelist: ['browse']
      })]
    })
    persistor.purge(['ui', 'navigation', 'browse'])

    if(module.hot) {
      module.hot.accept(() => {
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer());
      });
    }


    return store
  }else{
    const store = createNavigationEnabledStore(createStore)(
      createReducer(),
      compose(
        autoRehydrate(),
        applyMiddleware(...middlewares),
      )
    );
    persistStore(store, {
      storage: AsyncStorage,
      blacklist: ['navigation', 'AppNav', 'ui', 'potentials', 'browse'],
      transforms: [immutableTransform({
        whitelist: ['browse']
      })]
    })
    return store
  }
}

module.exports = configureStore;
