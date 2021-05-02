/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Alert,
  Image,
  Linking,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  globalStyles,
  lightGreyColor,
  lightGreyTextColor,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomDivider from '../common/CustomDivider';
import {toPascalCase} from '../../utils/StringFunctions';
import {Order} from '../ordersScreen/types/Order';
import {AuthState} from '../../store/actionsAndReducers/auth/reducers';
import {connect} from 'react-redux';
import {UserDetails} from '../../store/actionsAndReducers/auth/userDetails';
import {get12Hours, get24Hours, getDate} from '../../utils/DateTime';

interface OrderCardState {
  isOpen: boolean;
  itemsIsSelected: boolean;
  noteIsSelected: boolean;
  addressIsSelected: boolean;
  order: Order;
}

interface OrderCardProps {
  order: Order;
  navigation: any;
  user: UserDetails;
  // copyOrder: (order: Order, shop: TransformedShop) => void;
  // shops: TransformedShop[];
}

class OrderCard extends React.Component<OrderCardProps, OrderCardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      order: this.props.order,
      isOpen: true,
      itemsIsSelected: false,
      noteIsSelected: false,
      addressIsSelected: false,
    };
  }

  selectItems = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        itemsIsSelected: !prevState.itemsIsSelected,
      };
    });
  };

  render() {
    let order = this.state.order;
    // console.log(order.deliveryType);
    // console.log(typeof order.shopContact);
    let deliveryTypeStyleForCollection =
      order.deliveryType === 'C'
        ? {
            paddingHorizontal: 18,
            paddingVertical: 4,
            backgroundColor: primaryColor,
            color: 'white',
            borderRadius: normalRoundness,
          }
        : {
            paddingHorizontal: 18,
            paddingVertical: 4,
            borderWidth: 0.5,
            borderColor: lightGreyTextColor,
            backgroundColor: 'white',
            borderRadius: normalRoundness,
          };
    let deliveryTypeStyleForDelivery =
      this.state.order.deliveryType !== 'C'
        ? {
            paddingHorizontal: 18,
            paddingVertical: 4,
            // borderWidth: 0.5,
            backgroundColor: primaryColor,
            color: 'white',
            borderRadius: normalRoundness,
          }
        : {
            paddingHorizontal: 18,
            paddingVertical: 4,
            borderWidth: 0.5,
            borderColor: lightGreyTextColor,
            backgroundColor: 'white',
            borderRadius: normalRoundness,
          };
    let isItemsSelected = this.state.itemsIsSelected;
    const {estimatedDeliveryTime} = this.state.order;
    // let deliveryTime = estimatedDeliveryTime.split('T')[1];
    // let displayTime =
    //   deliveryTime.split(':')[0] + ':' + deliveryTime.split(':')[1];
    let displayTime =
      // getDate(new Date(estimatedDeliveryTime)) +
      // ' ' +
      get12Hours(new Date(estimatedDeliveryTime));
    let address = order.address;
    const {noteIsSelected} = this.state;
    return (
      <View>
        <View
          style={{
            marginHorizontal: 12,
            padding: 12,
            paddingHorizontal: 16,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
            marginVertical: 8,
            borderRadius: normalRoundness,
          }}>
          <View style={{flexDirection: 'row'}}>
            {/* <View style={{flex: 0.6}}>
              <Image
                source={{uri: this.state.order.shopImageUrl}}
                style={{
                  width: 44,
                  height: 44,
                  alignSelf: 'center',
                  borderRadius: normalRoundness,
                  backgroundColor: 'white',
                }}
              />
            </View> */}
            <View style={{marginHorizontal: 6, flex: 2}}>
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
                    Order ID{': '}
                    <Text style={[globalStyles.normalText]}>
                      {order.orderId}
                    </Text>
                  </Text>
                </View>
              </View>
              <Text>{order.shopName}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={[globalStyles.lightText]}>
                Dated: {order.estimatedDeliveryTime.split('T')[0]}
              </Text>
              <Text style={[globalStyles.lightText]}>
                Status: {toPascalCase(order.status.replace(/_/gi, ' '))}
              </Text>
            </View>
          </View>
          {this.state.isOpen && (
            <>
              <View>
                {/* Collection row */}
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 6,
                      marginTop: 12,
                      marginHorizontal: 6,
                    }}>
                    <View style={deliveryTypeStyleForCollection}>
                      <Text
                        style={[
                          globalStyles.normalText,
                          {
                            color:
                              order.deliveryType === 'C'
                                ? 'white'
                                : lightGreyTextColor,
                          },
                        ]}>
                        Collection
                      </Text>
                    </View>
                    <View style={deliveryTypeStyleForDelivery}>
                      <Text
                        style={[
                          globalStyles.normalText,
                          {
                            color:
                              order.deliveryType === 'D'
                                ? 'white'
                                : lightGreyTextColor,
                          },
                        ]}>
                        Delivery
                      </Text>
                    </View>
                  </View>
                  {/*<CustomDivider style={{marginHorizontal: 6, marginTop: 0}} />*/}
                </View>
                {/* Delivery time row */}
                <View>
                  <TouchableWithoutFeedback
                    style={{flex: 1}}
                    // onPress={() =>{}}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 6,
                        marginHorizontal: 6,
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
                          Est. Delivery time
                        </Text>
                      </View>
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
                          {displayTime}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  {/*<CustomDivider style={{marginHorizontal: 6, marginTop: 0}} />*/}
                </View>
                {/* Items row */}
                <View>
                  <TouchableWithoutFeedback
                    style={{flex: 1}}
                    onPress={() => this.selectItems()}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginVertical: 12,
                        marginHorizontal: 6,
                      }}>
                      <Text style={[globalStyles.normalText]}>Items</Text>
                      {!isItemsSelected ? (
                        <MaterialIcons
                          name="keyboard-arrow-right"
                          size={20}
                          color={lightGreyTextColor}
                        />
                      ) : (
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={20}
                          color={lightGreyTextColor}
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                  <CustomDivider style={{marginHorizontal: 6, marginTop: 0}} />
                  {isItemsSelected &&
                    order.products.map((product) => {
                      return (
                        <View
                          // style={{
                          // }}
                          key={product.productId}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              alignContent: 'center',
                              justifyContent: 'center',
                              paddingVertical: 12,
                            }}>
                            {/*Remove icon*/}
                            {/*<View style={{justifyContent: 'center'}}>*/}
                            {/*  <MaterialIcons*/}
                            {/*    name="close"*/}
                            {/*    size={12}*/}
                            {/*    color={primaryColor}*/}
                            {/*  />*/}
                            {/*</View>*/}
                            {/*product Pic*/}
                            <View style={{marginHorizontal: 6}}>
                              <Image
                                source={{uri: product.productUrl}}
                                style={{
                                  width: 40,
                                  height: 40,
                                  alignSelf: 'center',
                                }}
                                resizeMode={'contain'}
                              />
                            </View>
                            {/*Name and Price*/}
                            <View
                              style={{justifyContent: 'flex-start', flex: 1}}>
                              <Text style={[globalStyles.normalText]}>
                                {product.productName}
                              </Text>
                              <Text style={[globalStyles.normalText]}>
                                £{product.price}
                              </Text>
                            </View>
                            {/*Product values*/}
                            <View
                              style={{
                                // flex: 1,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                // backgroundColor: 'red'
                              }}>
                              <View
                                style={{
                                  borderRadius: normalRoundness,
                                  borderWidth: 0.5,
                                  marginHorizontal: 6,
                                  paddingVertical: 2,
                                  paddingHorizontal: 6,
                                }}>
                                <Text style={[globalStyles.normalTitle]}>
                                  {product.quantity}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <CustomDivider
                            style={{marginHorizontal: 6, marginTop: 0}}
                          />
                        </View>
                      );
                    })}
                </View>
                {/* Delivery address */}
                <View>
                  <TouchableWithoutFeedback
                    style={{flex: 1}}
                    onPress={
                      () => {
                        this.setState((prevState) => ({
                          addressIsSelected: !prevState.addressIsSelected,
                        }));
                      }
                      // this.props.navigation.navigate('CookiesPolicy')
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 12,
                        marginHorizontal: 6,
                      }}>
                      <Text style={[globalStyles.normalText]}>
                        Delivery address
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={[globalStyles.lightText]}>
                          {order.address.pinCode}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <CustomDivider style={{marginHorizontal: 6, marginTop: 0}} />
                  {this.state.addressIsSelected && (
                    <>
                      <View
                        style={{
                          width: '100%',
                          marginVertical: 12,
                          marginHorizontal: 6,
                        }}>
                        <Text style={[globalStyles.normalText]}>
                          {address.line_1}
                        </Text>
                        <Text style={[globalStyles.normalText]}>
                          {address.line_2}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                          <Text style={[globalStyles.normalText]}>
                            {address.county}
                            {address.county.length > 0 ? ' - ' : ''}
                          </Text>
                          <Text style={[globalStyles.normalText]}>
                            {address.pinCode}
                          </Text>
                        </View>
                      </View>
                      <CustomDivider
                        style={{marginHorizontal: 6, marginTop: 0}}
                      />
                    </>
                  )}
                </View>
                {/*Contact row*/}
                <View>
                  <TouchableWithoutFeedback
                    style={{flex: 1}}
                    onPress={() => {
                      // this.props.navigation.navigate('CookiesPolicy')
                      if (Linking.canOpenURL(`tel:${order.shopContact}`)) {
                        Linking.openURL(`tel:${order.shopContact}`);
                      } else {
                        Alert.alert(
                          "This shouldn't happen. Please try again after some time",
                        );
                      }
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 12,
                        marginHorizontal: 6,
                      }}>
                      <Text style={[globalStyles.normalText]}>Contact</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={[globalStyles.lightText]}>
                          {order.shopContact}
                        </Text>
                        <MaterialIcons
                          name="keyboard-arrow-right"
                          size={20}
                          color={lightGreyTextColor}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <CustomDivider style={{marginHorizontal: 6, marginTop: 0}} />
                </View>
                {/* Note */}
                <View>
                  <TouchableWithoutFeedback
                    style={{flex: 1}}
                    onPress={() =>
                      this.setState((prevState) => ({
                        noteIsSelected: !prevState.noteIsSelected,
                      }))
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 12,
                        marginHorizontal: 6,
                      }}>
                      <Text style={[globalStyles.normalText]}>Note</Text>
                      <MaterialIcons
                        name={
                          noteIsSelected
                            ? 'keyboard-arrow-down'
                            : 'keyboard-arrow-right'
                        }
                        size={20}
                        color={lightGreyTextColor}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <CustomDivider style={{marginHorizontal: 6, marginTop: 0}} />
                  {noteIsSelected && (
                    <>
                      <View
                        style={{
                          width: '100%',
                          marginVertical: 12,
                          marginHorizontal: 6,
                        }}>
                        <Text style={[globalStyles.normalText]}>
                          {this.state.order.note === undefined
                            ? 'No note'
                            : this.state.order.note}
                          {/*{console.log(typeof this.state.order.note)}*/}
                        </Text>
                      </View>
                      <CustomDivider
                        style={{marginHorizontal: 6, marginTop: 0}}
                      />
                    </>
                  )}
                </View>
                {/* Total Items row */}
                <View>
                  <TouchableWithoutFeedback
                    style={{flex: 1}}
                    onPress={() =>
                      this.props.navigation.navigate('CookiesPolicy')
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 12,
                        marginHorizontal: 6,
                      }}>
                      <Text style={[globalStyles.normalText]}>Total:</Text>
                      <View
                        style={{
                          // marginTop: 12,
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
                          £{order.totalPrice}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  {/*<CustomDivider style={{marginHorizontal: 6}} />*/}
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    );
  }
}
function mapStateToProps(state: {auth: AuthState}) {
  return {
    user: state.auth.user,
  };
}
export default connect(mapStateToProps)(OrderCard);
