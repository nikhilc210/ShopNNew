import {combineReducers} from 'redux';
import {cartReducer} from './cart/reducers';
import {shopsReducer} from './shops/reducers';
import {authReducer} from './auth/reducers';
import {locationReducer} from './location/reducers';
import {routeReducer} from './route/reducers';

export default combineReducers({
  cart: cartReducer,
  shops: shopsReducer,
  auth: authReducer,
  location: locationReducer,
  route: routeReducer,
});
