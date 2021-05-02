/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  FlatList,
  View,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import {ProductItem} from './ProductItem';
import RBSheet from 'react-native-raw-bottom-sheet';
import CartAddBottomSheet from './CartAddBottomSheet';
import {baseUrl} from '../../utils/config';
// import {connect} from 'react-redux';
// import {ActivityIndicator} from 'react-native-paper';
import CustomActivityIndicator from '../common/CustomActivityIndicator';
import {connect} from 'react-redux';
import {Route} from 'react-native-tab-view';
import {TransformedShop} from '../../store/types/shop';
import {Product} from '../../store/types/product';
import {normalRoundness, primaryColor} from '../../style/globalStyles';

const windowHeight = Dimensions.get('window').height;
// const bottomSheetRadius = 32;

class ProductComponent extends React.Component<
  {
    route: Route;
    navigation: any;
    subCategory: any;
    shop: TransformedShop;
    cart: any;
  },
  {
    hasLoaded: boolean;
    fetching: boolean;
    products: Product[];
    selectedProduct: Product | undefined;
  }
> {
  private sheetRef: any;
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: undefined,
      hasLoaded: false,
      fetching: true,
      products: [],
    };
  }

  async componentDidMount() {
    this.loadProducts();
  }
  async loadProducts() {
    try {
      const shopId = this.props.shop.id;
      const url =
        baseUrl +
        '/products/ofShop/' +
        shopId +
        '/' +
        this.props.subCategory.id;
      const response = await fetch(url, {
        method: 'GET',
      }).then((response1) => response1.json());
      this.setState({
        hasLoaded: true,
        fetching: false,
        products: response.map(
          (product: {
            id: number;
            product_name: string;
            description: string;
            template: {
              product_image: string;
            };
            product_price: number;
            product_stock: number;
            is_halal: boolean;
            prescription_required: boolean;
          }) => ({
            productId: product.id.toString(),
            productName: product.product_name,
            productDesc: product.description,
            productUrl: product.template.product_image,
            price: product.product_price.toFixed(2).toString(),
            subCategoryId: this.props.subCategory.id,
            stock: product.product_stock,
            isPrescriptionRequired: product.prescription_required,
            isHalal: product.is_halal,
          }),
        ),
      });
    } catch (e) {
      console.log(e);
      this.setState({hasLoaded: true, fetching: true});
    }
  }

  selectProduct(product) {
    this.setState({
      selectedProduct: product,
    });
  }

  render() {
    if (this.state.hasLoaded) {
      let selectedProd = this.state.selectedProduct;
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFF',
          }}>
          {/*<Text>Hello</Text>*/}
          <FlatList
            data={this.state.products}
            keyExtractor={(item) => item.productId.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={[primaryColor, primaryColor]}
                refreshing={this.state.fetching}
                onRefresh={() => {
                  this.setState({fetching: true}, () => {
                    this.loadProducts();
                  });
                }}
              />
            }
            contentContainerStyle={{
              paddingBottom: 40,
            }}
            renderItem={(item) => {
              let currentProduct = item.item;
              return (
                <ProductItem
                  selectedProd={selectedProd}
                  selectProduct={(product) => {
                    this.selectProduct(product);
                  }}
                  currentProduct={currentProduct}
                  toggleSheet={() => this.sheetRef.open()}
                />
              );
            }}
          />
          <RBSheet
            ref={(ref) => {
              this.sheetRef = ref;
            }}
            closeOnDragDown={false}
            height={
              Platform.OS === 'ios' ? windowHeight * 0.94 : windowHeight * 0.96
            }
            customStyles={{
              wrapper: {
                // backgroundColor: "transparent",
              },
              container: {
                borderTopLeftRadius: normalRoundness,
                borderTopRightRadius: normalRoundness,
                backgroundColor: 'white',
              },
              draggableIcon: {
                backgroundColor: 'white',
              },
            }}>
            <CartAddBottomSheet
              shop={this.props.shop}
              product={selectedProd}
              sheetRef={this.sheetRef}
              {...this.props}
            />
          </RBSheet>
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
          <CustomActivityIndicator color={primaryColor} size={'large'} />
        </View>
      );
    }
  }
}

function mapStateToProps(state: any) {
  return {
    cart: state.cart,
  };
}

export default connect(mapStateToProps)(ProductComponent);
