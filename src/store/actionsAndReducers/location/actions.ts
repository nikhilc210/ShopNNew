export const SET_USER_LOCATION: string = 'SET_USER_LOCATION';

export function setUserLocation(userLocation) {
  return {
    type: SET_USER_LOCATION,
    userLocation: userLocation,
  };
}
