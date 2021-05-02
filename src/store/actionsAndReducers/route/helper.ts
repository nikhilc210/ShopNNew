import {primaryColor} from '../../../style/globalStyles';

interface ScreenHelper {
  name: string;
  color: string;
}

const screens: ScreenHelper[] = [
  {name: 'HomeBottomNav', color: primaryColor},
  {name: 'Home', color: primaryColor},
  {name: 'Profile', color: primaryColor},
  {name: 'Orders', color: primaryColor},
  {name: 'OrderDetails', color: primaryColor},
  {name: 'LoginScreen', color: 'white'},
  {name: 'RegisterScreen', color: 'white'},
  {name: 'AddressScreen', color: 'white'},
  {name: 'Login', color: 'white'},
  {name: 'ShoppingCart', color: primaryColor},
  {name: 'OrderDetails', color: primaryColor},
  {name: 'Feedback', color: primaryColor},
  {name: 'Shop', color: primaryColor},
  {name: 'ShopShop', color: 'white'},
  {name: 'Products', color: 'white'},
  {name: 'TermsAndConditions', color: 'white'},
  {name: 'PrivacyPolicy', color: 'white'},
  {name: 'CookiesPolicy', color: 'white'},
  {name: 'ReturnPolicy', color: 'white'},
  {name: 'FilterResults', color: primaryColor},
  {name: 'ShopSearchResults', color: 'white'},
  {name: 'ProductSearchResults', color: 'white'},
];

export const getScreenColor = (screenName: string) => {
  return screens.filter((screen) => {
    return screen.name === screenName;
  })[0]?.color;
};
