/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Component} from 'react';
import {View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  globalStyles,
  primaryColor,
  lightGreyColor,
  lightGreyTextColor,
  normalRoundness,
} from '../../style/globalStyles';
import CustomDivider from '../common/CustomDivider';
import OrderStatus from '../../utils/OrderStatuses';
import {toPascalCase} from '../../utils/StringFunctions';
import {Order} from './types/Order';
import {get12Hours, getDate} from '../../utils/DateTime';

export default class UpcomingOrdersComponent extends Component<
  {
    order: Order;
    navigation: any;
  },
  any
> {
  constructor(props) {
    super(props);
  }

  render() {
    const {order} = this.props;
    const {products} = order;
    let totalItems = 0;
    products.forEach((product) => {
      totalItems += product.quantity;
    });
    let orderStatusColor =
      order.status === OrderStatus.READY ? primaryColor : 'black';
    return (
      <TouchableWithoutFeedback
        key={order.orderId}
        onPress={() => {
          this.props.navigation.navigate('OrderDetails', {
            order: order,
          });
        }}
        style={{
          marginHorizontal: 12,
        }}>
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            backgroundColor: 'white',
            elevation: 4,
            marginVertical: 8,
            marginHorizontal: 8,
            borderRadius: normalRoundness,
          }}>
          <View
            style={{
              // marginHorizontal: 12,
              padding: 12,
              paddingHorizontal: 16,
              paddingVertical: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              {/* <View style={{flex: 1}}>
                <Image
                  source={{uri: order.shopImageUrl}}
                  style={{
                    width: 44,
                    height: 44,
                    alignSelf: 'center',
                    borderRadius: normalRoundness,
                    backgroundColor: 'white',
                  }}
                  // resizeMode={'contain'}
                />
              </View> */}
              <View style={{marginHorizontal: 6, flex: 4}}>
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
                <Text
                  style={[
                    globalStyles.normalText,
                    {
                      marginStart: 4,
                    },
                  ]}>
                  {order.shopName}
                </Text>
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
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 6,
                  marginTop: 12,
                }}>
                <View
                  style={{
                    backgroundColor: lightGreyColor,
                    borderRadius: normalRoundness,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}>
                  <Text
                    style={[
                      globalStyles.normalText,
                      globalStyles.greyBackgroundTextColor,
                    ]}>
                    {order.deliveryType === 'C'
                      ? 'Collection'
                      : order.deliveryType === 'D'
                      ? 'Delivery'
                      : order.deliveryType}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    marginStart: 4,
                  }}>
                  <Image
                    source={require('../../assets/delivery.png')}
                    style={{
                      width: 20,
                      height: 20,
                      // backgroundColor: 'red',
                      tintColor: primaryColor,
                    }}
                  />
                </View>
              </View>
              {/*<CustomDivider style={{marginHorizontal: 0, marginTop: 0}} />*/}
              {order.estimatedDeliveryTime ? (
                <View style={{flexDirection: 'row', marginVertical: 6}}>
                  <View
                    style={{
                      backgroundColor: lightGreyColor,
                      borderRadius: normalRoundness,
                      flexDirection: 'row',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}>
                    <Text
                      style={[
                        globalStyles.normalText,
                        globalStyles.greyBackgroundTextColor,
                      ]}>
                      Estimated Delivery Time:{' '}
                      {getDate(new Date(order.estimatedDeliveryTime)) +
                        ' ' +
                        get12Hours(new Date(order.estimatedDeliveryTime))}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      marginStart: 4,
                    }}>
                    <Image
                      source={require('../../assets/opening_times_icon.png')}
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: primaryColor,
                      }}
                    />
                  </View>
                </View>
              ) : null}
              {/*<CustomDivider style={{marginHorizontal: 0, marginTop: 0}} />*/}
              <View style={{flexDirection: 'row', marginVertical: 6}}>
                <View
                  style={{
                    backgroundColor: lightGreyColor,
                    borderRadius: normalRoundness,
                    flexDirection: 'row',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}>
                  <Text
                    style={[
                      globalStyles.normalText,
                      globalStyles.greyBackgroundTextColor,
                      globalStyles.greyBackgroundTextColor,
                    ]}>
                    Status:{'  '}
                    <Text style={{color: orderStatusColor}}>
                      {toPascalCase(order.status.replace(/_/gi, ' '))}
                    </Text>
                  </Text>
                </View>
              </View>
              {/*<CustomDivider style={{marginHorizontal: 0, marginTop: 0}} />*/}
            </View>
            <View
              style={{
                marginHorizontal: 6,
                marginTop: 6,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  backgroundColor: lightGreyColor,
                  borderRadius: normalRoundness,
                  flexDirection: 'row',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
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
                  backgroundColor: lightGreyColor,
                  borderRadius: normalRoundness,
                }}>
                <Text
                  style={[
                    globalStyles.normalText,
                    globalStyles.greyBackgroundTextColor,
                    {fontSize: 12},
                  ]}>
                  £{order.totalPrice}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
