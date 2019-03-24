export default function facebookAlbumsReducer(state = initialState, action) {

    switch (action.type) {

    case 'FETCH_FACEBOOK_ALBUMS_FULFILLED':
        return {
          ...state,
          ...action.payload.data.reduce((sum,alb) => {
              sum[alb.id] = alb
              return sum
          },{})
        };

    case 'LOG_OUT':
    case 'LOG_OUT_FULFILLED':

        return initialState;

    default:

        return state;
    }
}


const initialState = {}
