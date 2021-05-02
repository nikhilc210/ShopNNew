import * as React from 'react';
import {Alert} from 'react-native';
// Persistent Redux
import {Provider} from 'react-redux';
import {persistor, store} from './store/store';
import {PersistGate} from 'redux-persist/integration/react';

// Google Sign-in
import {GoogleSignin} from '@react-native-community/google-signin';
import {FIREBASE_WEB_CLIENT_ID} from './utils/firebase';
import messaging from '@react-native-firebase/messaging';
import GetLocation from 'react-native-get-location';
import {setUserLocation} from './store/actionsAndReducers/location/actions';
import InnerView from './routes/InnerView';

// Configuration function
function configureGoogleSign() {
  GoogleSignin.configure({
    webClientId: FIREBASE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message for an Order: ', remoteMessage);
});

class App extends React.Component {
  constructor(props) {
    super(props);
    // this.requestUserPermission();
  }

  async loadLocation() {
    try {
      if (store.getState().shops.shopsLoaded) {
        const userLoc = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 12000,
        });
        store.dispatch(setUserLocation(userLoc));
      }
    } catch (e) {
      const {code, message} = e;
      if (code === 'UNAVAILABLE') {
        Alert.alert(
          'Location not found',
          'Kindly enable the location services for shopn from the settings.',
        );
      } else if (code === 'UNAUTHORIZED') {
        console.log('Location services unavailable');
      }
      console.log(code, message);
      console.log(e);
    }
  }
  componentDidMount() {
    console.log('Hello World1');
    messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
      console.log('Message for an order', JSON.stringify(remoteMessage));
    });
    configureGoogleSign();
    setInterval(() => {
      this.loadLocation();
    }, 20000);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <InnerView />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
