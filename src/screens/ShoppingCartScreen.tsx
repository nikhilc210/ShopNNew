/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import CustomAppBar from '../components/common/CustomAppBar';
import {
  globalStyles,
  lightGreyTextColor,
  normalRoundness,
  primaryColor,
  secondaryColor,
} from '../style/globalStyles';
import CartShopCard from '../components/cartScreen/CartShopCard';
import stripe from '../utils/paymentDetails';
import {baseUrl} from '../utils/config';
import {connect} from 'react-redux';
import {CartState} from '../store/types/CartState';
import {clearCart} from '../store/actionsAndReducers/cart/actions';
import {AuthState} from '../store/actionsAndReducers/auth/reducers';
import {LocationState} from '../store/actionsAndReducers/location/reducers';
import {
  calculateDistanceFromShop,
  calculateStatus,
  SHOP_IS_CLOSED,
} from '../utils/ShopSupportFunctions';
import CustomActivityIndicator from '../components/common/CustomActivityIndicator';
import AddressSheet from './utility/AddressSheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ShopStore} from '../store/actionsAndReducers/shops/reducers';
import PrefersHomeIndicatorAutoHidden from 'react-native-home-indicator';
import {Address} from '../store/types/address';
import SimpleToast from 'react-native-simple-toast';

const windowHeight = Dimensions.get('window').height;

class ShoppingCartScreen extends React.Component<
  {
    auth: AuthState;
    location: LocationState;
    cart: CartState;
    shops: ShopStore;
    navigation: any;
    route: any;
    emptyCart: any;
  },
  {
    totalPrice: number;
    userLocation: any;
    processingOrders: boolean;
  }
> {
  private addressSheet: any;
  constructor(props) {
    super(props);
    this.state = {
      processingOrders: false,
      totalPrice: 0,
      userLocation: this.props.location.userLocation,
    };
  }

  private checkAddressLineVerification(text: string) {
    return text !== undefined && /^[ a-zA-Z0-9,-]+$/.test(text);
  }

  private checkPinCodeVerification(text: string) {
    // const text = this.state.pinCode.data;
    return text !== undefined && /^[ A-Z0-9]{5,8}$/.test(text);
  }

  private verifyAddress(address: Address[]) {
    const activeAddress = address[0];
    return (
      this.checkAddressLineVerification(activeAddress.line_1) &&
      this.checkAddressLineVerification(activeAddress.line_2) &&
      this.checkPinCodeVerification(activeAddress.pinCode)
    );
  }

  async handlePayment() {
    if (!this.props.auth.loggedInStatus) {
      SimpleToast.show('Please login to proceed', SimpleToast.SHORT);
      this.props.navigation.navigate('Login');
      return;
    } else if (!this.verifyAddress(this.props.auth.user.address)) {
      SimpleToast.show(
        'Please enter a valid address for delivery.',
        SimpleToast.SHORT,
      );
      this.addressSheet.open();
      return;
    }
    try {
      this.setState({processingOrders: true});
      let shopsToSend = [];
      const {user} = this.props.auth;
      for (const [shopsKey, order] of Object.entries(this.props.cart.shops)) {
        const shop = this.props.shops.shops.filter((shopInstance) => {
          return shopInstance.id === order.shopDetails.id;
        })[0];
        if (
          calculateStatus(shop.openTimings, shop.shop_open) === SHOP_IS_CLOSED
        ) {
          Alert.alert(
            order.shopDetails.shopName.trim() + ' is closed',
            order.shopDetails.shopName.trim() +
              ' is currently closed. Hence you cannot place any order right now. Please try again after they open.',
          );
          this.setState({processingOrders: false});
          return;
        }
      }
      for (const [shopsKey, order] of Object.entries(this.props.cart.shops)) {
        let dist = calculateDistanceFromShop(
          this.props.location.userLocation,
          order.shopDetails.location,
        ).distance;

        const shopObj = {
          id: order.shopDetails.id,
          deliveryType: order.deliveryType,
          note: order.note,
          products: [],
          time: order.deliveryType === 'D' ? 15 + dist * 0.000621371 * 10 : 10,
        };
        for (const [productId, product] of Object.entries(order.products)) {
          shopObj.time += 2;
          shopObj.products.push({
            productId: product.productId,
            quantity: product.quantity,
          });
        }
        // console.log(typeof shopObj.time);
        shopObj.time = Math.round(shopObj.time);
        // console.log(shopObj.time);
        shopsToSend.push(shopObj);
      }
      const address = user.address[0];
      // console.log(address);

      // country: 'United Kingdom',
      const paymentMethod = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        theme: {
          primaryBackgroundColor: 'white',
          primaryForegroundColor: 'grey',
          accentColor: primaryColor,
          errorColor: 'red',
          secondaryBackgroundColor: 'white',
          secondaryForegroundColor: lightGreyTextColor,
        },
        managedAccountCurrency: 'GBP',
        prefilledInformation: {
          email: user.email,
          phone: user.mobile_no,
          billingAddress: {
            name: user.name,
            line1: address.line_1,
            line2: address.line_2,
            city: '',
            state: '',
            postalCode: address.pinCode,
            country: 'UK',
            email: user.email,
            phone: user.mobile_no,
          },
        },
      });
      const paymentIntentResult = await fetch(
        baseUrl + '/transactions/create-payment-intent',
        {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.auth.auth_token}`,
          }),
          body: JSON.stringify({
            paymentMethod,
            shops: shopsToSend,
          }),
        },
      )
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          throw error;
        });
      // @ts-ignore
      const result = await stripe.confirmPaymentIntent({
        clientSecret: paymentIntentResult.clientSecret,
        // @ts-ignore
        paymentMethodId: paymentMethod.id,
      });

      let resultX = await fetch(baseUrl + '/gen/transactions', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.auth.auth_token}`,
        }),
        body: JSON.stringify({
          transaction_date: Date.now(),
          transaction_amount: paymentIntentResult.amount,
          intent_id: result.paymentIntentId,
        }),
      });

      const transactionObj = await resultX.json();
      await fetch(baseUrl + '/orders/placeOrder', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.auth.auth_token}`,
        }),
        body: JSON.stringify({
          customerId: this.props.auth.user.id,
          addressLine: 0,
          transactionId: transactionObj.id,
          orders: shopsToSend,
        }),
      });
      this.setState({processingOrders: false});
      this.props.emptyCart();
    } catch (e) {
      this.setState({processingOrders: false});
      console.log(e);
      if (e.code === 'cancelled') {
        return;
      }
      Alert.alert(
        'Unable to proceed with the payment. Please try again after some time',
      );
    }
  }

  render() {
    let totalPrice = 0;
    for (const [shopsKey, order] of Object.entries(this.props.cart.shops)) {
      totalPrice +=
        order.deliveryType === 'D' ? order.shopDetails.deliveryCharge : 0;
      for (const [productId, product] of Object.entries(order.products)) {
        totalPrice += product.quantity * product.price;
      }
    }
    const numberOfOrders = Object.keys(this.props.cart.shops).length;
    const {address} = this.props.auth.user;
    const pinCode = address[this.props.cart.address]?.pinCode?.trim();
    if (numberOfOrders > 0) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#eee',
          }}>
          <CustomAppBar {...this.props} />
          <PrefersHomeIndicatorAutoHidden />
          <ScrollView
            contentContainerStyle={{paddingBottom: windowHeight * 0.2}}>
            {Object.keys(this.props.cart.shops).map((shopId) => {
              const shop = this.props.cart.shops[shopId];
              return (
                <CartShopCard
                  key={shopId}
                  navigation={this.props.navigation}
                  userLocation={this.state.userLocation}
                  order={shop}
                  {...this.props}
                />
              );
            })}
          </ScrollView>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              alignContent: 'center',
              alignItems: 'center',
              elevation: 5,
            }}>
            <TouchableWithoutFeedback
              style={{backgroundColor: 'red', flex: 1}}
              onPress={() => {
                if (this.props.auth.loggedInStatus) {
                  this.addressSheet.open();
                } else {
                  this.props.navigation.navigate('Login');
                }
              }}>
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                }}>
                <Text style={[globalStyles.normalText]}>
                  Delivery Address:{' '}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      globalStyles.normalText,
                      {color: lightGreyTextColor},
                    ]}>
                    {this.props.auth.loggedInStatus
                      ? pinCode !== ''
                        ? pinCode
                        : 'Validate your address'
                      : 'Please Login'}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>

            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 12,
              }}>
              <Text style={[globalStyles.normalText]}>
                Total Payment Value:{' '}
              </Text>
              <Text
                style={[globalStyles.normalText, {color: lightGreyTextColor}]}>
                £ {totalPrice.toFixed(2).toString()}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: primaryColor,
                width: '100%',
              }}
              disabled={this.state.processingOrders}
              onPress={() => this.handlePayment()}>
              <View
                style={{
                  paddingVertical: Platform.OS === 'ios' ? 16 : 12,
                }}>
                {!this.state.processingOrders ? (
                  <Text
                    style={[
                      globalStyles.normalTitle,
                      {color: 'white', textAlign: 'center'},
                    ]}>
                    Proceed to payment
                  </Text>
                ) : (
                  <CustomActivityIndicator color={'white'} size={'small'} />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <RBSheet
            ref={(ref) => {
              this.addressSheet = ref;
            }}
            closeOnDragDown={false}
            height={Dimensions.get('window').height * 0.5}
            customStyles={{
              container: {
                borderTopLeftRadius: normalRoundness,
                borderTopRightRadius: normalRoundness,
                backgroundColor: primaryColor,
              },
              draggableIcon: {
                backgroundColor: primaryColor,
              },
            }}>
            <AddressSheet
              {...this.props}
              navigation={this.props.navigation}
              closeSheet={() => this.addressSheet.close()}
            />
          </RBSheet>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#eee',
          }}>
          <CustomAppBar {...this.props} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              flex: 1,
            }}>
            <Image
              source={require('../assets/shopping_cart_icon.png')}
              style={{
                width: '20%',
                height: '10%',
                tintColor: primaryColor,
                marginBottom: 20,
              }}
            />
            <Text style={[globalStyles.normalTitle]}>Empty Cart.</Text>
            <Text style={[globalStyles.normalText]}>
              Head out to any store and pick any product you want!
            </Text>
          </View>
        </View>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    cart: state.cart,
    auth: state.auth,
    location: state.location,
    shops: state.shops,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    emptyCart: () => {
      return dispatch(clearCart());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCartScreen);
