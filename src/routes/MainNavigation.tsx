import * as React from 'react';
import {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import SplashScreen from 'react-native-splash-screen';

import CustomBottomTabBar from '../components/common/CustomBottomTabBar';
import HomeScreen from '../screens/bottomNav/HomeScreen';
import OrdersScreen from '../screens/bottomNav/OrdersScreen';
import ProfileScreen from '../screens/bottomNav/ProfileScreen';
import ShopScreen from '../screens/shop/ShopScreen';
import ShopShopScreen from '../screens/shop/ShopShopScreen';
import ProductsScreen from '../screens/shop/ProductsScreen';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';
import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/login/RegisterScreen';
import LegacyAddressScreen from '../screens/login/LegacyAddressScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import FeedbackSheet from '../screens/FeedbackSheet';
import FilterResultsScreen from '../screens/utility/FilterResultsScreen';
import TermsAndConditions from '../screens/policies/TermsAndConditions';
import PrivacyPolicy from '../screens/policies/PrivacyPolicy';
import CookiesPolicy from '../screens/policies/CookiesPolicy';
import ReturnPolicy from '../screens/policies/ReturnPolicy';

import {connect} from 'react-redux';
import ShopSearchResult from '../screens/utility/ShopSearchResult';
import ProductsResultScreen from '../screens/utility/ProductsResultScreen';
import {changeRouteName} from '../store/actionsAndReducers/route/actions';

const MainNavigator = createStackNavigator();
const LoginStack = createStackNavigator();
const BottomTabNavigator = createBottomTabNavigator();

// const cartConfig = {
//   animation: 'spring',
//   config: {
//     stiffness: 1000,
//     damping: 500,
//     mass: 3,
//     overshootClamping: true,
//     restDisplacementThreshold: 0.01,
//     restSpeedThreshold: 0.01,
//   },
// };

const BottomTabScreens = (props) => {
  return (
    <BottomTabNavigator.Navigator
      tabBar={(bottomTabBarProps) => (
        <CustomBottomTabBar
          {...bottomTabBarProps}
          barStyle={{
            marginBottom: 20,
            marginHorizontal: 20,
            backgroundColor: 'transparent',
          }}
        />
      )}>
      <BottomTabNavigator.Screen name="Home" component={HomeScreen} />
      <BottomTabNavigator.Screen
        name="Orders"
        options={{tabBarVisible: props.auth.loggedInStatus}}
        component={!props.auth.loggedInStatus ? LoginScreenStack : OrdersScreen}
      />
      <BottomTabNavigator.Screen
        name="Profile"
        options={{tabBarVisible: false}}
        component={
          !props.auth.loggedInStatus ? LoginScreenStack : ProfileScreen
        }
      />
    </BottomTabNavigator.Navigator>
  );
};

const LoginScreenStack = () => {
  return (
    <LoginStack.Navigator screenOptions={{headerShown: false}}>
      <LoginStack.Screen
        options={{
          title: 'Login',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
        name="LoginScreen"
        component={LoginScreen}
      />
      <LoginStack.Screen
        options={{
          title: 'Register',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
        name="RegisterScreen"
        component={RegisterScreen}
      />
      <LoginStack.Screen name="AddressScreen" component={LegacyAddressScreen} />
    </LoginStack.Navigator>
  );
};

class MainNavigation extends Component<{
  auth: any;
  changeRouteName: any;
}> {
  constructor(props) {
    super(props);
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }
  render() {
    return (
      <NavigationContainer
        onStateChange={(state) => {
          console.log(state?.routes[state?.routes.length - 1]);
          this.props.changeRouteName(
            state?.routes[state?.routes.length - 1].name,
          );
        }}
        onReady={() => {
          this.props.changeRouteName('HomeBottomNav');
        }}>
        <MainNavigator.Navigator screenOptions={{headerShown: false}}>
          <MainNavigator.Screen
            name="HomeBottomNav"
            component={connect(mapStateToProps)(BottomTabScreens)}
          />
          <MainNavigator.Screen
            options={{
              title: 'Login',
              ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
            name="Login"
            component={LoginScreenStack}
          />

          <MainNavigator.Screen
            options={{
              title: 'ShoppingCart',
              ...TransitionPresets.SlideFromRightIOS,
            }}
            name="ShoppingCart"
            component={ShoppingCartScreen}
          />
          <MainNavigator.Screen
            name="OrderDetails"
            component={OrderDetailsScreen}
          />
          <MainNavigator.Screen name="Feedback" component={FeedbackSheet} />
          <MainNavigator.Screen name="Shop" component={ShopScreen} />
          <MainNavigator.Screen
            options={{
              title: 'ShopShop',
              ...TransitionPresets.SlideFromRightIOS,
            }}
            name="ShopShop"
            component={ShopShopScreen}
          />
          <MainNavigator.Screen
            options={{
              title: 'Products',
              ...TransitionPresets.SlideFromRightIOS,
            }}
            name="Products"
            component={ProductsScreen}
          />
          <MainNavigator.Screen
            name="TermsAndConditions"
            component={TermsAndConditions}
          />
          <MainNavigator.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
          />
          <MainNavigator.Screen
            name="CookiesPolicy"
            component={CookiesPolicy}
          />
          <MainNavigator.Screen name="ReturnPolicy" component={ReturnPolicy} />
          <MainNavigator.Screen
            name="FilterResults"
            component={FilterResultsScreen}
          />
          <MainNavigator.Screen
            name="ShopSearchResults"
            component={ShopSearchResult}
          />
          <MainNavigator.Screen
            name="ProductSearchResults"
            component={ProductsResultScreen}
          />
        </MainNavigator.Navigator>
      </NavigationContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeRouteName: (routeName) => dispatch(changeRouteName(routeName)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);
