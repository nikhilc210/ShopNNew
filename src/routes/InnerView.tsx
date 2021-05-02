import * as React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Platform, StatusBar, View} from 'react-native';
import MainNavigation from './MainNavigation';
import {connect} from 'react-redux';
import {getScreenColor} from '../store/actionsAndReducers/route/helper';
import {primaryColor} from '../style/globalStyles';
import {RouteState} from '../store/actionsAndReducers/route/reducers';
import PrefersHomeIndicatorAutoHidden from 'react-native-home-indicator';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {logout} from '../store/actionsAndReducers/auth/actions';

function InnerView(props) {
  React.useEffect(() => {
    if (appleAuth.isSupported) {
      // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
      return appleAuth.onCredentialRevoked(async () => {
        console.warn(
          'If this function executes, User Credentials have been Revoked',
        );
        props.logout();
      });
    }
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  const statusBarColor = getScreenColor(props.routeName);
  const barStyle =
    statusBarColor === primaryColor ? 'light-content' : 'dark-content';
  return (
    <>
      <SafeAreaView
        {...props}
        style={{backgroundColor: statusBarColor, flex: 0}}
      />
      <View
        style={{
          flex: 1,
          marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        }}>
        <StatusBar
          translucent={true}
          backgroundColor={statusBarColor}
          barStyle={barStyle}
        />
        <PrefersHomeIndicatorAutoHidden />
        <MainNavigation />
      </View>
    </>
  );
}

function mapStateToProps(state: {route: RouteState}) {
  return {
    routeName: state.route.routeName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InnerView);
