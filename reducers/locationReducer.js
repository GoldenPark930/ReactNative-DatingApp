export default function locationReducer(state = initialState, action) {

   switch (action.type) {

   case "GOT_LOCATION":
        
      return {
        ...action.payload
      }
   default:

        return state;
    }
}


const initialState = {};
