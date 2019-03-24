

import Promise from 'bluebird'

import { Image, NativeModules, ImageStore, Platform } from 'react-native'
import _ from 'lodash'

const {ImageLoader, } = NativeModules
const PREFETCH_STARTED = 'PREFETCH_STARTED';
const PREFETCH_COMPLETE = 'PREFETCH_COMPLETE';

export default function createPrefetcher(config = {}) {
  // defaults


  // config
  const {
    debug = __DEV__,
    watchKeys,
  } = config;

  return ({ dispatch, getState }) => (next) => (action) => {
    // Exit early if predicate function returns 'false'
    // if (typeof predicate === 'function' && !predicate(getState, action)) {
    //   return next(action);
    // }
    //
    const state = getState();


    const imgKey = Object.keys(watchKeys[0])[0]


    if(action.type == imgKey){
      const incoming = action.payload.matches

      processStateKey(imgKey, state.potentials, incoming, () => {})
    }else{
      return next(action)
    }


    function processStateKey(pointer, stateValue, incoming, callback){
      let images = [];
      if(debug) console.log(incoming);
      if(!incoming || !incoming.length){
        return next(action)
      }
    // If it's an array, assume we're dealing with a collection of things that will each have one or more images
      if(Array.isArray(incoming)){
      // if the user provided a mapping to the image url inside a collection item
      // if (typeof watchKeys === 'object'){
        images = incoming.reduce((sum, item) => {
          if(item.user.image_url){
            sum.push(item.user.image_url)
          }
          return sum

        }, [])

      }else if(typeof incoming === 'object' && incoming.user){
        // dont decened uet
        images = Object.keys(incoming[pointer]).reduce((imgs, item) => {
          if(debug) console.log(item);
          if(item.substr(0, 4) == 'http'){
            imgs.push(item[watchKeys[pointer]])
          }

          return imgs
        }, []);
      }
      if(debug){ console.log(images); }


      let cacheCheck;
      if(Platform.OS == 'android'){

        return ImageLoader.queryCache(images).then(cache => {
          if(debug) console.log('cache', cache);
          const uncached = _.difference(images, Object.keys(cache))
          if(debug) console.log('uncached', uncached, 'going to prefetch')
          return uncached
        })
        .then(images => {
          if(debug) console.log('cachecheck', images);
          if(!images) return false

          const imagesToPrefetchFirst = images.slice(0, 3);

          return Promise.map(imagesToPrefetchFirst, (uri, i) => {
            if(debug) console.log('prefetch (1)', uri, i, Date.now());
            return Image.prefetch(uri)
          }, {concurrency: 3})
        })
        .then(results => {
          if(debug) console.log('Batch 2');
          return Promise.all(images.slice(3, images.length).map((uri, i) => new Promise((resolve, reject) => {
            if(debug) console.log('prefetch (2)', uri, i, Date.now());
            return Image.prefetch(uri).then(resolve).catch(resolve)
          })))


        })
        .then(results => {
          if(debug) console.log('LAST STEP', results);
          next(action)
          if(debug) console.log('done', results, Date.now());
          if(debug) console.log('prefetched', results);

        })


      }else{
        const imagesToPrefetchFirst = images.slice(0, 3);
        const imagesToPrefetchLast = images.slice(3, images.length)
        if(debug){ console.log('Batch 1'); }

        Promise.mapSeries(imagesToPrefetchFirst, (uri, i) => Image.prefetch(uri))
        .then(() => Promise.mapSeries(imagesToPrefetchLast, (uri, i) => Image.prefetch(uri)))
        .then(() => next(action))
        .catch(err => {
          console.log(err);
          return next(action)
        })
      }
    }
  }
}


function prefetchStartedAction(payload, error = null) {
  return {
    type: PREFETCH_STARTED,
    payload,
    error
  }
}


function prefetchCompleteAction(payload, error = null) {
  return {
    type: PREFETCH_COMPLETE,
    payload,
    error
  }
}
