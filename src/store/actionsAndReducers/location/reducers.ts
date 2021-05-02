import {SET_USER_LOCATION} from './actions';

export interface LocationState {
  userLocationLoaded: boolean;
  userLocation: {
    latitude: string;
    longitude: string;
  };
}

const initialLocationState: LocationState = {
  userLocationLoaded: false,
  userLocation: {
    latitude: '52.476929',
    longitude: '-1.893240',
  },
};

export const locationReducer = (state = initialLocationState, action: any) => {
  if (action.type === SET_USER_LOCATION) {
    // console.log('Just absolutely trying to log the userLoc');
    // console.log(action);
    return {
      ...state,
      userLocationLoaded: true,
      userLocation: action.userLocation,
    };
  } else {
    return state;
  }
};
