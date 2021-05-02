/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import CustomAppBar from '../components/common/CustomAppBar';
import OrderCard from '../components/orderScreen/OrderCard';
import CustomActivityIndicator from '../components/common/CustomActivityIndicator';
import {baseUrl} from '../utils/config';
import {connect} from 'react-redux';
import {
  globalStyles,
  normalRoundness,
  primaryColor,
} from '../style/globalStyles';
import {TransformedShop} from '../store/types/shop';
import {addProduct} from '../store/actionsAndReducers/cart/actions';
import OrderStatus from '../utils/OrderStatuses';
import RBSheet from 'react-native-raw-bottom-sheet';
import FeedbackSheet from './FeedbackSheet';
import {Order} from '../components/ordersScreen/types/Order';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface FullProductDetails {
  id: number;
  shop_id: number;
  template_id: number;
  sub_category_id: number;
  product_name: string;
  product_price: number;
  description: string;
  product_stock: number;
  is_halal: boolean;
  prescription_required: boolean;
  createdAt: string;
  updatedAt: string;
  template: {
    id: number;
    sub_category_id: number;
    product_name: string;
    product_image: string;
    shop_type: string;
    createdAt: string;
    updatedAt: string;
  };
}

class OrderDetailsScreen extends React.Component<
  any,
  {
    isLoading: boolean;
    order: Order;
    orderIsUpdating: boolean;
    orderCompleted: boolean;
    copyOrder: boolean;
  }
> {
  private feedbackSheet: any;
  constructor(props) {
    super(props);
    this.state = {
      copyOrder: false,
      orderCompleted: false,
      orderIsUpdating: false,
      isLoading: false,
      order: {
        ...this.props.route.params.order,
        productDetailsAreLoaded: false,
        // address:
        //   'Vanguard Supermarket\nHurst St, Birmingham B5 4TD\n0121 622 3668',
      },
    };
  }

  changeDeliveryOption = (option) => {
    this.setState((prevState) => ({
      order: {
        ...prevState.order,
        deliveryType: option,
      },
    }));
  };

  async loadProductDetails() {
    this.setState({isLoading: true});
    const {token} = this.props;
    const url = baseUrl + '/products/getFullDetails/';
    try {
      for (const product of this.state.order.products) {
        await fetch(url + product.productId, {
          method: 'GET',
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        })
          .then((response) => response.json())
          .then((productDetails: FullProductDetails) => {
            product.productName = productDetails.product_name;
            product.productUrl = productDetails.template.product_image;
            product.price = productDetails.product_price;
          });
      }
      this.setState((prevState) => ({
        isLoading: false,
        order: {
          ...prevState.order,
          productDetailsAreLoaded: true,
        },
      }));
    } catch (e) {
      console.log(e);
      this.setState({isLoading: false});
    }
  }

  async componentDidMount() {
    this.loadProductDetails();
  }

  render() {
    const {order} = this.state;
    if (order.productDetailsAreLoaded) {
      const {status} = order;
      const readyForAccepting =
        status === OrderStatus.ON_THE_WAY || status === OrderStatus.REACHED;
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#eee',
          }}>
          <CustomAppBar
            title={'Order from ' + order.shopName}
            {...this.props}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 64}}>
            <OrderCard order={order} navigation={this.props.navigation} />
          </ScrollView>
          <View
            style={{
              width: '100%',
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'center',
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}>
            {!this.state.copyOrder ? (
              <TouchableWithoutFeedback
                style={{
                  flex: 1,
                  width: '100%',
                }}
                onPress={() => {
                  // console.log(this.props.shops);
                  let shop = this.props.shops.filter(
                    (shopObj: TransformedShop) => {
                      return shopObj.id == order.shopId;
                    },
                  );
                  // console.log(shop);
                  this.props.copyOrder(this.state.order, shop[0]);
                  this.setState({copyOrder: true});
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={[globalStyles.normalTitle, {textAlign: 'center'}]}>
                    Order Again
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <View
                style={{
                  marginVertical: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <MaterialIcons
                  style={{alignSelf: 'center'}}
                  name={'check'}
                  size={12}
                  color={primaryColor}
                />
              </View>
            )}
          </View>
          {readyForAccepting ? (
            <View
              style={{
                width: '100%',
                backgroundColor: primaryColor,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 12,
              }}>
              <TouchableWithoutFeedback
                style={{
                  flex: 1,
                  width: '100%',
                }}
                onPress={async () => {
                  await this.deliverOrder();
                }}>
                <View style={{flex: 1}}>
                  {!this.state.orderCompleted ? (
                    <Text
                      style={[
                        globalStyles.normalTitle,
                        {color: 'white', textAlign: 'center'},
                      ]}>
                      Order has been delivered?
                    </Text>
                  ) : (
                    <MaterialIcons
                      style={{alignSelf: 'center'}}
                      name={'check'}
                      size={14}
                      color={'white'}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : null}
          <RBSheet
            ref={(ref) => {
              this.feedbackSheet = ref;
              // console.log(this.sheetRef);
            }}
            closeOnDragDown={false}
            height={Dimensions.get('window').height * 0.7}
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
            <FeedbackSheet
              {...this.props}
              navigation={this.props.navigation}
              order={order}
              closeSheet={() => this.feedbackSheet.close()}
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
            // marginTop: StatusBar.currentHeight,
          }}>
          <CustomAppBar title={'Order of ' + order.shopName} {...this.props} />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <CustomActivityIndicator size={'small'} color={primaryColor} />
            <Text style={[globalStyles.normalText, {marginTop: 20}]}>
              One moment...
            </Text>
          </View>
        </View>
      );
    }
  }

  async deliverOrder() {
    this.setState({orderIsUpdating: true});
    try {
      const {order} = this.state;
      const url = baseUrl + '/orders/changeOrderStatus';
      const body = {
        orderId: order.orderId,
        status: OrderStatus.COMPLETED,
      };
      const result = await fetch(url, {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${this.props.token}`,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
      });
      if (result.ok) {
        this.setState({orderIsUpdating: false, orderCompleted: true});
        this.feedbackSheet.open();
      } else {
        Alert.alert('Error completing the order. Please try again');
        this.setState({orderIsUpdating: false});
      }
    } catch (e) {
      console.log(e);
      this.setState({orderIsUpdating: false});
      Alert.alert('Error completing the order. Please try again');
    }
  }
}

function mapStateToProps(state) {
  return {
    token: state.auth.auth_token,
    shops: state.shops.shops,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    copyOrder: (order: Order, shop: TransformedShop) =>
      order.products.forEach((product) => {
        dispatch(
          addProduct({
            shopDetails: {...shop},
            product: {
              ...product,
              shopId: Number(order.shopId),
            },
          }),
        );
      }),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailsScreen);
