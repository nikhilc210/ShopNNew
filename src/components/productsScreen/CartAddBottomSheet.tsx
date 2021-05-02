/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import {
  globalStyles,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {addProduct} from '../../store/actionsAndReducers/cart/actions';
import {Product} from '../../store/types/product';
import {TransformedShop} from '../../store/types/shop';
import {CartState} from '../../store/types/CartState';
import CustomActivityIndicator from '../common/CustomActivityIndicator';
import {CartProduct} from '../../store/types/cartProduct';
import SimpleToast from 'react-native-simple-toast';
// import {RadioButton} from "react-native-paper";
// import CustomDivider from "../common/CustomDivider";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

class CartAddBottomSheet extends React.Component<
  {
    product: Product;
    sheetRef: any;
    shop: TransformedShop;
    cart: CartState;
    addProduct: ({shopDetails, product}) => null;
  },
  {numberOfItems: number; isAdding: boolean}
> {
  constructor(props: any) {
    super(props);
    this.state = {
      numberOfItems: this.props.product.stock > 0 ? 1 : 0,
      isAdding: false,
    };
  }

  incrementItems() {
    const value =
      this.props.product.stock > this.state.numberOfItems
        ? this.state.numberOfItems + 1
        : this.state.numberOfItems;
    this.setState({
      numberOfItems: value,
    });
  }

  decrementItems() {
    this.setState({
      numberOfItems:
        this.state.numberOfItems === 0 ? 0 : this.state.numberOfItems - 1,
    });
  }

  addProductToCart = () => {
    let {product, shop} = this.props;
    if (this.state.numberOfItems > 0) {
      this.setState({isAdding: true});
      let productDetails = {
        shopDetails: shop,
        product: {
          ...product,
          quantity: this.state.numberOfItems,
        } as CartProduct,
      };
      this.props.addProduct(productDetails);
      this.setState({isAdding: false});
      SimpleToast.show('Added to Shopn cart', SimpleToast.SHORT, [
        'RCTModalHostViewController',
        'UIAlertController',
      ]);
      this.props.sheetRef.close();
    }
  };

  render() {
    let {product, sheetRef} = this.props;
    const buttonSize = 32;
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor: 'white',
          minHeight: '100%',
          alignContent: 'center',
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 72 : 0,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
          <TouchableWithoutFeedback onPress={() => sheetRef.close()}>
            <View>
              <MaterialIcons name={'close'} size={30} color={primaryColor} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: product.productUrl}}
            style={{
              width: windowWidth * 0.3,
              height: windowHeight * 0.25,
              alignSelf: 'center',
            }}
            resizeMode={'contain'}
          />
          <Text
            style={[
              globalStyles.normalTitle,
              {
                textAlign: 'center',
                marginVertical: 6,
                paddingVertical: 0,
                paddingHorizontal: 18,
                lineHeight: 21,
                height: 24,
                fontSize: 12,
              },
            ]}>
            {product.productName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 12,
          }}>
          {this.state.numberOfItems > 0 ? (
            <TouchableWithoutFeedback onPress={() => this.decrementItems()}>
              <View
                style={{
                  height: buttonSize,
                  width: buttonSize,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginEnd: 12,
                }}>
                <MaterialIcons
                  name="remove"
                  color={primaryColor}
                  size={buttonSize}
                />
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <View
              style={{
                height: buttonSize,
                width: buttonSize,
                marginEnd: 12,
              }}
            />
          )}
          <Text
            style={[globalStyles.normalTitle, {fontSize: 40, lineHeight: 44}]}>
            {this.state.numberOfItems}
          </Text>
          {this.state.numberOfItems !== product.stock ? (
            <TouchableWithoutFeedback onPress={() => this.incrementItems()}>
              <View
                style={{
                  height: buttonSize,
                  width: buttonSize,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginStart: 12,
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
                marginStart: 12,
              }}
            />
          )}
        </View>
        {product.stock === 0 ? (
          <View
            key={'stock'}
            style={{
              alignSelf: 'center',
              marginTop: 12,
            }}>
            <Text style={[globalStyles.lightText, {color: 'red'}]}>
              *Out of Stock
            </Text>
          </View>
        ) : null}
        <View
          style={{
            marginTop: 12,
          }}>
          <Text
            style={[
              globalStyles.normalTitle,
              {
                marginEnd: 12,
                fontSize: 12,
              },
            ]}>
            Description
          </Text>
          <Text
            style={[
              globalStyles.lightTitle,
              {
                paddingVertical: 2,
                marginVertical: 6,
                textAlignVertical: 'top',
                textAlign: 'justify',
                minHeight: 24 * 3,
              },
            ]}>
            {product.productDesc}
          </Text>
        </View>
        <View>
          <Text
            style={[
              globalStyles.normalTitle,
              {
                marginEnd: 12,
                fontSize: 12,
              },
            ]}>
            Price
          </Text>
          <Text
            style={[
              globalStyles.boldText,
              {
                paddingVertical: 0,
                // paddingHorizontal: 12,
                marginVertical: 6,
                width: '50%',
                height: 32,
              },
            ]}>
            £{product.price}
          </Text>
        </View>
        <View>
          <Text
            style={[
              globalStyles.normalText,
              {
                color: 'red',
              },
            ]}>
            {this.props.product.isPrescriptionRequired
              ? '*Prescription required'
              : null}
          </Text>
        </View>
        <View>
          <Text
            style={[
              globalStyles.normalText,
              {
                color: 'red',
              },
            ]}>
            {this.props.product.isHalal ? '*Halal' : null}
          </Text>
        </View>
        <View
          style={{
            marginVertical: 12,
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 12 : 0,
            left: 12,
            right: 12,
          }}>
          {this.state.numberOfItems > 0 && (
            <View
              style={{
                alignSelf: 'center',
                width: '100%',
                margin: 12,
                borderRadius: normalRoundness,
                backgroundColor: primaryColor,
                marginBottom: Platform.OS === 'ios' ? 12 : 0,
              }}>
              <TouchableWithoutFeedback
                style={{flex: 1}}
                onPress={() => {
                  this.addProductToCart();
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 12,
                  }}>
                  {this.state.isAdding ? (
                    <CustomActivityIndicator color={'white'} size={'small'} />
                  ) : (
                    <Text style={[globalStyles.normalText, {color: 'white'}]}>
                      Add to Order
                    </Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    cart: state.cart,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addProduct: ({
      shopDetails,
      product,
    }: {
      shopDetails: TransformedShop;
      product: CartProduct;
    }) => dispatch(addProduct({shopDetails, product})),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CartAddBottomSheet);
