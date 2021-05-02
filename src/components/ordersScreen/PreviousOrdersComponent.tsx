/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Component} from 'react';
import {View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  globalStyles,
  normalRoundness,
  primaryColor,
  lightGreyColor,
  lightGreyTextColor,
} from '../../style/globalStyles';
import {Order} from './types/Order';

export default class UpcomingOrdersComponent extends Component<
  {
    order: Order;
    navigation: any;
  },
  {}
> {
  constructor(props) {
    super(props);
  }

  render() {
    const {order} = this.props;
    let totalItems = 0;
    const {products} = order;
    products.forEach((product) => {
      // @ts-ignore
      if (typeof product.quantity !== Number) {
        totalItems += Number(product.quantity);
      } else {
        totalItems += product.quantity;
      }
    });
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          this.props.navigation.navigate('OrderDetails', {
            order,
          })
        }>
        <View
          style={{
            marginHorizontal: 12,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            padding: 12,
            paddingHorizontal: 16,
            paddingVertical: 20,
            backgroundColor: 'white',
            elevation: 4,
            marginVertical: 8,
            borderRadius: normalRoundness,
          }}>
          {/*<View*/}
          {/*  style={{*/}
          {/*    marginHorizontal: 6,*/}
          {/*    marginBottom: 12,*/}
          {/*  }}>*/}
          {/*  <Text style={[globalStyles.normalText]}>*/}
          {/*    Dated: {order.estimatedDeliveryTime.split('T')[0]}*/}
          {/*  </Text>*/}
          {/*</View>*/}
          <View style={{flexDirection: 'row'}}>
            {/* <View style={{flex: 1}}>
              <Image
                source={{uri: order.shopImageUrl}}
                style={{
                  width: 44,
                  height: 44,
                  alignSelf: 'center',
                  borderRadius: normalRoundness,
                }}
              />
            </View> */}
            <View
              style={{
                marginHorizontal: 6,
                flex: 4,
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    backgroundColor: primaryColor,
                    borderRadius: normalRoundness,
                  }}>
                  <Text
                    style={[
                      globalStyles.normalText,
                      {
                        paddingVertical: 4,
                        paddingHorizontal: 12,
                        textAlign: 'center',
                        color: 'white',
                      },
                    ]}>
                    Order ID: {order.orderId}
                  </Text>
                </View>
              </View>
              <Text style={[globalStyles.normalText]}>{order.shopName}</Text>
              {/* <Text style={[globalStyles.normalText]}>{order.shopName}</Text> */}
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={lightGreyTextColor}
              />
            </View>
          </View>
          <View
            style={{
              marginHorizontal: 6,
              marginTop: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 12,
                backgroundColor: lightGreyColor,
                borderRadius: normalRoundness,
              }}>
              <Text
                style={[
                  globalStyles.normalText,
                  globalStyles.greyBackgroundTextColor,
                ]}>
                Total: {totalItems} Items
              </Text>
            </View>
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 12,
                backgroundColor: primaryColor,
                borderRadius: normalRoundness,
              }}>
              <Text style={[globalStyles.normalText, {color: 'white'}]}>
                £{order.totalPrice}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
