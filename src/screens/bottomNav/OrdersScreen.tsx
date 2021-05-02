/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Component} from 'react';
import {View} from 'react-native';
import CustomAppBar from '../../components/common/CustomAppBar';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import UpcomingOrdersScreen from '../../components/ordersScreen/UpcomingOrdersScreen';
import PreviousOrdersScreen from '../../components/ordersScreen/PreviousOrdersScreen';
import OrdersTabLayout from '../../components/ordersScreen/OrdersTabLayout';
import {connect} from 'react-redux';

const OrdersTab = createMaterialTopTabNavigator();

class OrdersScreen extends Component<any, any> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomAppBar {...this.props} />
        <OrdersTab.Navigator tabBar={OrdersTabLayout}>
          <OrdersTab.Screen
            name="UpcomingOrders"
            options={{
              tabBarLabel: 'Upcoming',
            }}>
            {/* @ts-ignore */}
            {() => <UpcomingOrdersScreen {...this.props} />}
          </OrdersTab.Screen>
          <OrdersTab.Screen
            name="PreviousOrders"
            options={{
              tabBarLabel: 'Previous',
            }}>
            {/* @ts-ignore */}
            {() => <PreviousOrdersScreen {...this.props} />}
          </OrdersTab.Screen>
        </OrdersTab.Navigator>
      </View>
    );
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

export default connect(mapStateToProps)(OrdersScreen);
