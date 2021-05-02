export const LOAD_SHOPS = 'LOAD_SHOPS';
export const NOT_LOADED_SHOP = 'NOT_LOADED_SHOP';

export function setShops(shops) {
  return (dispatch, getState) => {
    const {userLocation} = getState().location;
    return dispatch({
      type: LOAD_SHOPS,
      shops: shops,
      userLocation: userLocation,
    });
  };
}

export function errorInFetch(err) {
  return {
    type: NOT_LOADED_SHOP,
    error: err,
  };
}
