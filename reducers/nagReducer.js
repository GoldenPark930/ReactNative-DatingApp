
export default function nagReducer(state = initialState, action) {

  switch (action.type) {
  case 'ASKED_PARTNER':
    return {...state, askedPartner: true };
  case 'ASKED_LOCATION':
    return {...state, askedLocation: true, askLocation: false };
  case 'ASKED_NOTIFICATION':
    return {...state, askedNotification: true, askNotification: false };
  case 'ASKED_RELATIONSHIP_STATUS':
    return {...state, askedRelationshipStatus: true };

  case 'GET_USER_INFO':
    return {...state, askedRelationshipStatus: action.payload.relationship_status ? true : false }

  case 'SEND_LIKE_FULFILLED':
    return state

  case 'UNASKED_LOCATION':
    return {...state, askedLocation: false };

  case 'SET_ASK_NOTIFICATION':
    return {...state, askNotification: true };

  case 'SET_ASK_LOCATION':
    return {...state, askLocation: true };

  case 'GET_STARTER_POTENTIALS':
    return {...state, sawStarterPotentials: true };


  default:

    return state;
  }
}


const initialState = {
  askedPartner: false,
  askedNotification: false,
  askedLocation: false,
  askedRelationshipStatus: false,
  sawStarterPotentials: false
};
