import AsyncStorage from '@react-native-community/async-storage';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './actionsAndReducers';
import {persistStore, persistReducer} from 'redux-persist';

const initialState = {};

const persistConfig = {
  key: 'Shopn',
  storage: AsyncStorage,
  whitelist: ['cart', 'auth'],
  blacklist: ['route'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];

export const store = createStore(
  persistedReducer,
  initialState,
  applyMiddleware(...middleware),
);

export const persistor = persistStore(store);
