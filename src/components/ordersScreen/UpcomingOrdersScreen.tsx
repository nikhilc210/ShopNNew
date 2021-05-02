/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Component} from 'react';
import {View, RefreshControl, FlatList, Text} from 'react-native';
import UpcomingOrdersComponent from './UpcomingOrdersComponent';
import NoOrderComponent from './NoOrderComponent';
import CustomActivityIndicator from '../common/CustomActivityIndicator';
import {globalStyles, primaryColor} from '../../style/globalStyles';
import {connect} from 'react-redux';
import {baseUrl} from '../../utils/config';
import {UserDetails} from '../../store/actionsAndReducers/auth/userDetails';
import {AuthState} from '../../store/actionsAndReducers/auth/reducers';
import {ApiOrder, Order} from './types/Order';
import {TransformedShop} from '../../store/types/shop';

class UpcomingOrdersScreen extends Component<
  {
    // orders: Order[];
    navigation: any;
    shopLoadStatus: boolean;
    shops: any;
    user: UserDetails;
    auth: AuthState;
  },
  {
    orders: Order[];
    noOrders: boolean;
    isLoading: boolean;
    fetching: boolean;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      noOrders: false,
      isLoading: true,
      fetching: true,
    };
  }

  componentDidMount() {
    this.loadOrders();
  }

  async loadOrders() {
    try {
      // this.setState({ isLoading: true });
      const {shops, user, auth} = this.props;
      if (shops.length === 0) {
        throw 'Shops not loaded';
      }
      const url = baseUrl + '/orders/upcomingOrders/' + user.id;
      const response: ApiOrder[] = await fetch(url, {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${auth.auth_token}`,
        }),
      }).then((responseForJson) => responseForJson.json());
      this.setState({
        isLoading: false,
        fetching: false,
        orders: response.map((order: ApiOrder) => {
          const orderShop: TransformedShop[] = shops.filter(
            (shop) => shop.id === order.shop_id,
          );
          return {
            orderId: order.id,
            shopName: orderShop[0].shopName,
            shopImageUrl: orderShop[0].imageUrl,
            shopId: orderShop[0].id,
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
      this.setState({isLoading: false, fetching: false});
    }
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <FlatList
            data={this.state.orders}
            keyExtractor={(item: Order, index) => {
              return (item.orderId + index).toString();
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}>
                  <NoOrderComponent />
                </View>
              );
            }}
            contentContainerStyle={
              this.state.orders.length > 0
                ? {paddingBottom: 100}
                : {flex: 1, backgroundColor: 'white'}
            }
            renderItem={(item) => {
              return (
                <UpcomingOrdersComponent
                  {...this.props}
                  navigation={this.props.navigation}
                  order={item.item}
                />
              );
            }}
            refreshControl={
              <RefreshControl
                colors={[primaryColor, primaryColor]}
                refreshing={this.state.fetching}
                onRefresh={() => {
                  this.setState({fetching: true}, () => {
                    this.loadOrders();
                  });
                }}
              />
            }
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            backgroundColor: 'white',
          }}>
          <CustomActivityIndicator color={primaryColor} />
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

export default connect(mapStateToProps)(UpcomingOrdersScreen);
