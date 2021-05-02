/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
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
import {TransformedShop} from '../../store/types/shop';
import {connect} from 'react-redux';
import {
  addNote,
  addProduct,
  changeDeliveryType,
  removeProduct,
  removeShop,
} from '../../store/actionsAndReducers/cart/actions';
import {CartProduct} from '../../store/types/cartProduct';
import {calculateDistanceFromShop} from '../../utils/ShopSupportFunctions';

interface ProductDetails {
  shopDetails: TransformedShop;
  product: CartProduct;
}

class CartShopCard extends React.Component<
  {
    order: {
      shopDetails: TransformedShop;
      note: string;
      deliveryType: string;
      deliveryCharge: string;
      estDeliveryTime: Date;
      totalPrice: number;
      products: {
        [key: number]: CartProduct;
      };
    };
    increaseQuantity: (productDetails) => void;
    decreaseQuantity: (productDetails) => void;
    removeProduct: (productDetails) => void;
    changeNote: (productDetails) => void;
    changeDeliveryType: (productDetails) => void;
    cancelOrder: (productDetails) => void;
    navigation: any;
    userLocation: {
      latitude: string;
      longitude: string;
    };
  },
  {
    isOpen: boolean;
    itemsIsSelected: boolean;
    isNoteSelected: boolean;
    totalPrice: number;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      itemsIsSelected: true,
      isNoteSelected: true,
      totalPrice: 0,
    };
  }

  expandCard = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isOpen: !prevState.isOpen,
      };
    });
  };

  selectItems = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        itemsIsSelected: !prevState.itemsIsSelected,
      };
    });
  };

  render() {
    let order = this.props.order;
    let {shopDetails} = order;
    let totalPrice =
      order.deliveryType === 'D' ? Number(order.deliveryCharge) : 0;
    let dist = calculateDistanceFromShop(
      this.props.userLocation,
      order.shopDetails.location,
    ).distance;
    let timeToDeliver =
      order.deliveryType === 'D' ? 10 + dist * 0.000621371 * 10 : 10;
    // console.log('Delivery fees: ' + totalPrice);
    let isDeliverySelectable: boolean = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [productId, product] of Object.entries(order.products)) {
      timeToDeliver += 2;
      if (product.isPrescriptionRequired) {
        isDeliverySelectable = false;
      }
      totalPrice += product.quantity * product.price;
    }
    let isOpen = this.state.isOpen;
    let isItemsSelected = this.state.itemsIsSelected;
    let buttonSize = 20;
    let deliveryTypeStyleForCollection =
      order.deliveryType === 'C'
        ? {
            paddingHorizontal: 18,
            paddingVertical: 4,
            // borderWidth: 0.5,
            // borderColor: primaryColor,
            backgroundColor: primaryColor,
            color: 'white',
            borderRadius: normalRoundness,
          }
        : {
            paddingHorizontal: 18,
            paddingVertical: 4,
            borderWidth: 0.5,
            borderColor: lightGreyTextColor,
            color: lightGreyTextColor,
            backgroundColor: 'white',
            borderRadius: normalRoundness,
          };
    let deliveryTypeStyleForDelivery =
      order.deliveryType !== 'C'
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
            color: lightGreyTextColor,
            backgroundColor: 'white',
            borderRadius: normalRoundness,
          };
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.expandCard();
        }}>
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
            {/* <View>
              <Image
                source={{uri: order.shopDetails.imageUrl}}
                style={{
                  width: 44,
                  height: 44,
                  alignSelf: 'center',
                }}
              />
            </View> */}
            <View style={{marginHorizontal: 6, flex: 2}}>
              <Text style={[globalStyles.normalTitle]}>
                {order.shopDetails.shopName}
              </Text>
              <Text
                style={[
                  globalStyles.normalText,
                  {color: '#999', fontSize: 12},
                ]}>
                {order.shopDetails.category} Store
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              {!isOpen && (
                <>
                  <View
                    style={{
                      // paddingVertical: 2,
                      paddingHorizontal: 12,
                      backgroundColor: '#C4C4C4',
                      borderRadius: normalRoundness,
                    }}>
                    <Text style={[globalStyles.normalText]}>View Items</Text>
                  </View>
                  <View
                    style={{
                      marginTop: 12,
                      paddingHorizontal: 8,
                      backgroundColor: '#C4C4C4',
                      borderRadius: normalRoundness,
                    }}>
                    <Text style={[globalStyles.normalText]}>
                      £{totalPrice.toFixed(2).toString()}
                    </Text>
                  </View>
                </>
              )}
              {isOpen && (
                <>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={30}
                    color={lightGreyTextColor}
                  />
                </>
              )}
            </View>
          </View>
          {this.state.isOpen && (
            <>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 6,
                    marginTop: 12,
                    marginHorizontal: 6,
                  }}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate('Shop', {
                        shop: shopDetails,
                        userLocation: this.props.userLocation,
                      })
                    }>
                    <View>
                      <Text style={[globalStyles.normalText]}>
                        Continue Shopping
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <View>
                    <Text style={[globalStyles.normalText]}>
                      Delivery fee: £{order.deliveryCharge}
                    </Text>
                  </View>
                </View>
                {/* Collection row */}
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 12,
                      marginHorizontal: 6,
                    }}>
                    <TouchableWithoutFeedback
                      style={deliveryTypeStyleForCollection}
                      onPress={() => {
                        if (order.deliveryType === 'D') {
                          this.props.changeDeliveryType({
                            shopDetails,
                          });
                        }
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
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      style={deliveryTypeStyleForDelivery}
                      onPress={() => {
                        if (order.deliveryType === 'C') {
                          // console.log(order.shopDetails.minimum_order_fee);
                          // console.log(totalPrice);
                          if (!isDeliverySelectable) {
                            Alert.alert(
                              'Prescription is required.',
                              'You cannot have this order delivered as a product in this order requires prescription. Hence kindly collect this order from the pharmacy.',
                            );
                          } else if (
                            Number(order.shopDetails.minimum_order_fee) >
                            Number(totalPrice)
                          ) {
                            Alert.alert(
                              'Continue Shopn',
                              order.shopDetails.shopName +
                                ' minimum order for delivery is £' +
                                order.shopDetails.minimum_order_fee +
                                '.',
                            );
                          } else if (
                            order.shopDetails.deliveryAvailability === false
                          ) {
                            Alert.alert(
                              'Delivery not available',
                              'This shop does not support delivery. Click and collect is available',
                            );
                          } else {
                            this.props.changeDeliveryType({
                              shopDetails,
                            });
                          }
                        }
                      }}>
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
                    </TouchableWithoutFeedback>
                  </View>
                  <CustomDivider style={{marginHorizontal: 6}} />
                </View>
                {/* Delivery time row */}
                <View>
                  <TouchableWithoutFeedback style={{flex: 1}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 12,
                        marginHorizontal: 6,
                      }}>
                      <Text style={[globalStyles.normalText]}>
                        Est. delivery time
                      </Text>
                      <Text
                        style={[
                          globalStyles.normalText,
                          {color: lightGreyTextColor},
                        ]}>
                        {timeToDeliver.toFixed() + ' min'}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <CustomDivider style={{marginHorizontal: 6}} />
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
                          color="#454545"
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                  <CustomDivider style={{marginHorizontal: 6}} />
                  {isItemsSelected &&
                    Object.keys(order.products).map((productId) => {
                      const product: CartProduct = order.products[productId];
                      return (
                        <View
                          key={productId}
                          style={{
                            paddingVertical: 6,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              alignContent: 'center',
                              justifyContent: 'center',
                            }}>
                            {/*Remove icon*/}
                            <View style={{justifyContent: 'center'}}>
                              <TouchableWithoutFeedback
                                onPress={() => {
                                  this.props.removeProduct({
                                    shopDetails,
                                    product,
                                  });
                                }}>
                                <MaterialIcons
                                  name="close"
                                  size={12}
                                  color={primaryColor}
                                />
                              </TouchableWithoutFeedback>
                            </View>
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
                              style={{
                                justifyContent: 'flex-start',
                                flex: 1,
                                marginEnd: 4,
                              }}>
                              <Text
                                ellipsizeMode={'tail'}
                                numberOfLines={1}
                                style={[globalStyles.normalText]}>
                                {product.productName}
                              </Text>
                              <Text style={[globalStyles.normalText]}>
                                £{product.price}
                              </Text>
                            </View>
                            {/*Product values*/}
                            <View
                              style={{
                                flexDirection: 'row',
                                alignSelf: 'center',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                              }}>
                              <TouchableWithoutFeedback
                                onPress={() =>
                                  this.props.decreaseQuantity({
                                    shopDetails,
                                    product,
                                  })
                                }>
                                <View
                                  style={{
                                    height: buttonSize,
                                    width: buttonSize,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <MaterialIcons
                                    name="remove"
                                    color={primaryColor}
                                    size={buttonSize}
                                  />
                                </View>
                              </TouchableWithoutFeedback>
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
                              {product.quantity !== product.stock ? (
                                <TouchableWithoutFeedback
                                  onPress={() =>
                                    this.props.increaseQuantity({
                                      shopDetails,
                                      product,
                                    })
                                  }>
                                  <View
                                    style={{
                                      height: buttonSize,
                                      width: buttonSize,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <MaterialIcons
                                      name="add"
                                      size={buttonSize}
                                      color={primaryColor}
                                    />
                                  </View>
                                </TouchableWithoutFeedback>
                              ) : (
                                <View
                                  style={{
                                    height: buttonSize,
                                    width: buttonSize,
                                  }}
                                />
                              )}
                            </View>
                          </View>
                          <CustomDivider
                            style={{marginHorizontal: 6, marginTop: 6}}
                          />
                        </View>
                      );
                    })}
                </View>
                {/* Note */}
                <View>
                  <TouchableWithoutFeedback
                    style={{flex: 1}}
                    onPress={() =>
                      // this.props.navigation.navigate('CookiesPolicy')
                      this.setState((state) => ({
                        isNoteSelected: !state.isNoteSelected,
                      }))
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 12,
                        marginHorizontal: 6,
                      }}>
                      <Text style={[globalStyles.normalText]}>Add a note</Text>
                      {!this.state.isNoteSelected ? (
                        <MaterialIcons
                          name="keyboard-arrow-right"
                          size={20}
                          color={lightGreyTextColor}
                        />
                      ) : (
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={20}
                          color="#454545"
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                  {this.state.isNoteSelected && (
                    <View>
                      <TextInput
                        // @ts-ignore
                        type={'text'}
                        onChangeText={(text) =>
                          this.props.changeNote({
                            product: undefined,
                            shopDetails: {
                              id: order.shopDetails.id,
                              note: text,
                            },
                          })
                        }
                        multiline={true}
                        numberOfLines={5}
                        selectionColor={primaryColor}
                        style={[
                          globalStyles.lightText,
                          {
                            width: '100%',
                            marginBottom: 4,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            justifyContent: 'flex-start',
                            textAlignVertical: 'top',
                            borderColor: lightGreyColor,
                            borderRadius: normalRoundness,
                            borderWidth: 1,
                            // backgroundColor: 'grey',
                          },
                        ]}
                        value={this.props.order.note}
                        placeholder={
                          'Add anything that you want to mention in the order.'
                        }
                        placeholderTextColor={lightGreyTextColor}
                        onEndEditing={(text) => {
                          this.props.changeNote({
                            product: undefined,
                            shopDetails: {
                              id: order.shopDetails.id,
                              note: text.nativeEvent.text,
                            },
                          });
                        }}
                      />
                    </View>
                  )}
                  <CustomDivider style={{marginHorizontal: 6}} />
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
                          paddingHorizontal: 8,
                          backgroundColor: '#C4C4C4',
                          borderRadius: normalRoundness,
                        }}>
                        <Text style={[globalStyles.normalText]}>
                          £{totalPrice.toFixed(2).toString()}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <CustomDivider style={{marginHorizontal: 6}} />
                </View>
                <View style={{marginVertical: 12}}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.cancelOrder({
                        shopDetails,
                        product: {},
                      })
                    }>
                    <View>
                      <Text
                        style={[
                          globalStyles.normalText,
                          {textAlign: 'center'},
                        ]}>
                        Cancel Order
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

function mapStateToProps(state) {
  return {
    shops: state.cart.shops,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    increaseQuantity: (productDetails: ProductDetails) => {
      const {product} = productDetails;
      const quantity =
        product.stock > product.quantity
          ? product.quantity + 1
          : product.quantity;
      return dispatch(
        addProduct({
          product: {
            ...productDetails.product,
            quantity,
          },
          shopDetails: productDetails.shopDetails,
        }),
      );
    },

    decreaseQuantity: (productDetails: ProductDetails) => {
      if (productDetails.product.quantity - 1 !== 0) {
        return dispatch(
          addProduct({
            product: {
              ...productDetails.product,
              quantity: productDetails.product.quantity - 1,
            },
            shopDetails: productDetails.shopDetails,
          }),
        );
      } else {
        return dispatch(removeProduct(productDetails));
      }
    },

    removeProduct: (productDetails: ProductDetails) =>
      dispatch(removeProduct(productDetails)),

    changeNote: (productDetails: ProductDetails) =>
      dispatch(addNote(productDetails)),

    changeDeliveryType: (productDetails: ProductDetails) =>
      dispatch(changeDeliveryType(productDetails)),

    cancelOrder: (productDetails: ProductDetails) =>
      dispatch(removeShop(productDetails)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CartShopCard);
