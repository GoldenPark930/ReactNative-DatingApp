import _ from 'lodash'

export default function cityStateReducer(state = initialState, action) {

  switch (action.type) {

    case 'CACHE_CITY':
      return {
        ...state,
        [action.payload.userId]: {
          cityState: action.payload.cityState,
          coords: action.payload.coords
        }
      };
    case 'GET_POTENTIALS_FULFILLED':
      return {
        ...state,
        ...(action.payload.matches.reduce((acc,el) => {
          if(el.cityState && el.cityState != ""){
            acc[el.id] = el.cityState
          }
          return acc
        },{}))
      }
      case 'GET_BROWSE_FULFILLED':
        return {
          ...state,
          ...(action.payload.reduce((acc,el) => {
            if(el.cityState && el.cityState != ""){
              acc[el.id] = el.cityState
            }
            return acc
          },{}))
        }

    default:

      return state;
  }
}


const initialState = {}
