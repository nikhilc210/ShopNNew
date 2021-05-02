/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, FlatList, Alert, RefreshControl, Text} from 'react-native';
import PreviousOrdersComponent from './PreviousOrdersComponent';
import CustomActivityIndicator from '../common/CustomActivityIndicator';
import NoOrderComponent from './NoOrderComponent';
import {connect} from 'react-redux';
import {UserDetails} from '../../store/actionsAndReducers/auth/userDetails';
import {AuthState} from '../../store/actionsAndReducers/auth/reducers';
import {TransformedShop} from '../../store/types/shop';
import {ApiOrder, Order} from './types/Order';
import {baseUrl} from '../../utils/config';
import {globalStyles, primaryColor} from '../../style/globalStyles';

const lastDate = new Date();
lastDate.setFullYear(2019);
lastDate.setMonth(11);

const MIN_ORDERS = 8;

class PreviousOrdersScreen extends React.Component<
  {
    navigation: any;
    route: any;
    shopLoadStatus: boolean;
    shops: TransformedShop[];
    user: UserDetails;
    auth: AuthState;
  },
  {
    orders: Order[];
    isLoading: boolean;
    fetching: boolean;
    nextDate: Date;
  }
> {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      fetching: true,
      orders: [],
      nextDate: new Date(),
    };
  }

  async loadMinOrders() {
    const {nextDate} = this.state;
    const {user, shops} = this.props;
    let apiOrders: ApiOrder[] = [];
    try {
      while (apiOrders.length < MIN_ORDERS) {
        if (nextDate > lastDate) {
          const url =
            baseUrl +
            '/orders/customerPreviousOrders/' +
            `${user.id}/${nextDate.getMonth() + 1}/${nextDate.getFullYear()}`;
          const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
              Authorization: `Bearer ${this.props.auth.auth_token}`,
            }),
          });
          if (response.ok) {
            const ordersFromApi: ApiOrder[] = await response.json();
            if (ordersFromApi === []) continue;
            console.log('Orders from API');
            console.log(ordersFromApi);
            apiOrders.push(...ordersFromApi);
            nextDate.setMonth(nextDate.getMonth() - 1);
          } else {
            Alert.alert(
              'Error: ' + response.status,
              'Please try again after some time.',
            );
            this.setState({isLoading: false, fetching: false});
            throw 'Error Reaching Server';
          }
        } else {
          break;
        }
      }
      // console.log('Setting the state first time');
      this.setState({
        isLoading: false,
        fetching: false,
        orders: apiOrders.map((order: ApiOrder) => {
          const orderShop = shops.filter((shop) => shop.id === order.shop_id);
          // console.log(orderShop);
          return {
            orderId: order.id,
            shopId: orderShop[0].id,
            shopName: orderShop[0].shopName,
            shopImageUrl: orderShop[0].imageUrl,
            shopContact: orderShop[0].mobile_number,
            deliveryType: order.delivery_type,
            products: JSON.parse(order.products),
            estimatedDeliveryTime: order.createdAt,
            status: order.status,
            totalItems: JSON.parse(order.products).length,
            cost: order.amount,
            productDetailsAreLoaded: false,
            totalPrice: order.amount,
            address: user.address[order.address_line],
            deliveryCharge: order.delivery_charge,
            note: order.note,
          };
        }),
      });
    } catch (e) {
      console.log(e);
    }
  }

  async loadMoreOrders() {
    const {nextDate, orders} = this.state;
    if (nextDate > lastDate) {
      this.setState({isLoading: true});
      try {
        let apiOrders: ApiOrder[];
        const {user, shops} = this.props;
        const url =
          baseUrl +
          '/orders/customerPreviousOrders/' +
          `${user.id}/${nextDate.getMonth() + 1}/${nextDate.getFullYear()}`;
        console.log(url);
        const response = await fetch(url, {
          method: 'GET',
          headers: new Headers({
            Authorization: `Bearer ${this.props.auth.auth_token}`,
          }),
        });
        if (response.ok) {
          apiOrders = await response.json();
          nextDate.setMonth(nextDate.getMonth() - 1);
          console.log('Calling setState for: ' + nextDate.getMonth());
        } else {
          Alert.alert(
            'Error: ' + response.status,
            'Please try again after some time.',
          );
          this.setState({isLoading: false, fetching: false});
          return;
        }
        console.log('Setting the state');
        this.setState({
          isLoading: false,
          fetching: false,
          orders: [
            ...orders,
            ...apiOrders.map((order: ApiOrder) => {
              const orderShop = shops.filter(
                (shop) => shop.id === order.shop_id,
              );
              console.log(orderShop);
              return {
                orderId: order.id,
                shopId: orderShop[0].id,
                shopName: orderShop[0].shopName,
                shopImageUrl: orderShop[0].imageUrl,
                shopContact: orderShop[0].mobile_number,
                deliveryType: order.delivery_type,
                products: JSON.parse(order.products),
                estimatedDeliveryTime: order.createdAt,
                status: order.status,
                totalItems: JSON.parse(order.products).length,
                cost: order.amount,
                productDetailsAreLoaded: false,
                totalPrice: order.amount,
                address: user.address[order.address_line],
                deliveryCharge: order.delivery_charge,
                note: order.note,
              };
            }),
          ],
        });
      } catch (e) {
        console.log(e);
        // Alert.alert(
        //   'Error in connection',
        //   'Error in connecting to the server. Please try again after some time.',
        // );
        this.setState({isLoading: false, fetching: false});
      }
    } else {
      console.log('In Else');
    }
  }

  componentDidMount() {
    this.loadMinOrders();
  }

  render() {
    const {orders, isLoading} = this.state;
    console.log('In previous orders');
    if (!isLoading) {
      return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <FlatList
            data={orders.reverse()}
            keyExtractor={(item, index) => item.orderId.toString() + index}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
              return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                  <NoOrderComponent />
                </View>
              );
            }}
            refreshControl={
              <RefreshControl
                colors={[primaryColor, primaryColor]}
                refreshing={this.state.fetching}
                onRefresh={() => {
                  this.setState(
                    {
                      fetching: true,
                      nextDate: new Date(),
                    },
                    () => {
                      this.loadMinOrders();
                    },
                  );
                }}
              />
            }
            // stickySectionHeadersEnabled={false}
            contentContainerStyle={
              orders.length > 0
                ? {paddingBottom: 100}
                : {flex: 1, backgroundColor: 'white'}
            }
            renderItem={({item}) => (
              <PreviousOrdersComponent {...this.props} order={item} />
            )}
            onEndReached={() => this.loadMoreOrders()}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <CustomActivityIndicator size={'small'} color={primaryColor} />
          <Text style={[globalStyles.normalText, {marginTop: 20}]}>
            One moment...
          </Text>
        </View>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    shopLoadStatus: state.shops.shopsLoaded,
    shops: state.shops.shops,
    user: state.auth.user,
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(PreviousOrdersScreen);
