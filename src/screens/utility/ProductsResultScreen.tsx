/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomSearchComponent from '../../components/common/CustomSearchComponent';
import {baseUrl} from '../../utils/config';
import {TransformedShop} from '../../store/types/shop';
import {Product} from '../../store/types/product';
import CustomActivityIndicator from '../../components/common/CustomActivityIndicator';
import {globalStyles, primaryColor} from '../../style/globalStyles';
import {ProductItem} from '../../components/productsScreen/ProductItem';
import RBSheet from 'react-native-raw-bottom-sheet';
import CartAddBottomSheet from '../../components/productsScreen/CartAddBottomSheet';

const windowHeight = Dimensions.get('window').height;

interface ApiProductSearchResult {
  id: number;
  shop_id: number;
  template_id: number;
  template: {
    product_image: string;
    shop_type: string;
    sub_category_id: number;
  };
  sub_category_id: number;
  product_name: string;
  product_price: number;
  description: string;
  product_stock: number;
  is_halal: boolean;
  prescription_required: boolean;
  createdAt: string;
  updatedAt: string;
}

class ProductsResultScreen extends React.Component<
  {
    route: {
      params: {
        shop: TransformedShop;
      };
    };
    navigation: any;
  },
  {
    query: string;
    isLoading: boolean;
    dataQueried: boolean;
    products: Product[];
    selectedProduct: Product | undefined;
  }
> {
  private addToCartSheetRef: any;
  private searchBarRef: any;
  constructor(props) {
    super(props);
    this.state = {
      dataQueried: false,
      products: [],
      selectedProduct: undefined,
      isLoading: false,
      query: '',
    };
  }
  selectProduct(product) {
    // console.log("Inside of selectProduct now");
    this.setState({
      selectedProduct: product,
    });
  }
  async searchProducts(text: string) {
    if (text.length > 3) {
      this.setState({isLoading: true});
      try {
        const {shop} = this.props.route.params;
        const url = `${baseUrl}/products/search/${shop.id}/${text}`;
        const productResults: ApiProductSearchResult[] = await fetch(
          url,
        ).then((result) => result.json());
        const products: Product[] = productResults.map((product) => {
          return {
            productId: product.id.toString(),
            productName: product.product_name,
            productDesc: product.description,
            productUrl: product.template.product_image,
            stock: product.product_stock,
            price: product.product_price,
            subCategoryId: product.sub_category_id,
            isHalal: product.is_halal,
            isPrescriptionRequired: product.prescription_required,
          };
        });
        this.setState({isLoading: false, products, dataQueried: true});
      } catch (e) {
        console.log(e);
        this.setState({isLoading: false});
        Alert.alert(
          'Unable to connect with the server. Please try again after some time',
        );
      }
    }
  }

  render() {
    const iconSize = 24;
    const iconColor = '#000000';
    const {
      query,
      isLoading,
      products,
      selectedProduct,
      dataQueried,
    } = this.state;

    const userHasNotSearchedJSX = (
      // User has not searched
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <Text style={[globalStyles.normalText]}>
          Tap and type in the searchbar to search a product
        </Text>
      </View>
    );

    const noProdAfterQueryResultJSX = (
      // No products after query result
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <Text style={[globalStyles.normalText]}>
          No such product exists in this shop
        </Text>
      </View>
    );

    const dataLoadingJSX = (
      //  Data is being fetched from the API
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <CustomActivityIndicator size={'small'} color={primaryColor} />
        <Text style={[globalStyles.normalText, {marginTop: 20}]}>
          {/*Please wait a min till I search the shop*/}
          One moment...
        </Text>
      </View>
    );

    return (
      <View style={{flex: 1}}>
        <View
          style={[
            customAppBarStyle.container,
            customAppBarStyle.shopShopAppBar,
          ]}>
          <View style={{marginHorizontal: 4, justifyContent: 'center'}}>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.pop()}>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={iconSize}
                color={iconColor}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={customAppBarStyle.shopShopContainer}>
            <CustomSearchComponent
              onChangeText={(text) => {
                if (text.length === 0) {
                  this.setState({
                    query: text,
                    dataQueried: false,
                    products: [],
                    selectedProduct: undefined,
                  });
                }
                this.setState({query: text});
              }}
              onEndEditing={(text) => {
                this.setState({query: text.nativeEvent.text});
                this.searchProducts(text.nativeEvent.text);
              }}
              value={query}
              placeholder={'Search products'}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
          {!isLoading ? (
            products.length > 0 ? (
              // Products are there after search results
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#FFF',
                }}>
                <FlatList
                  data={products}
                  keyExtractor={(item) => item.productId.toString()}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  renderItem={(item) => {
                    let currentProduct = item.item;
                    return (
                      <ProductItem
                        selectedProd={selectedProduct}
                        selectProduct={(product) => {
                          this.selectProduct(product);
                        }}
                        currentProduct={currentProduct}
                        toggleSheet={() => this.addToCartSheetRef.open()}
                      />
                    );
                  }}
                />
                <RBSheet
                  ref={(ref) => {
                    this.addToCartSheetRef = ref;
                  }}
                  closeOnDragDown={false}
                  height={windowHeight}
                  customStyles={{
                    container: {
                      borderTopLeftRadius: 32,
                      borderTopRightRadius: 32,
                      backgroundColor: 'white',
                    },
                    draggableIcon: {
                      backgroundColor: 'white',
                    },
                  }}>
                  <CartAddBottomSheet
                    shop={this.props.route.params.shop}
                    product={selectedProduct}
                    sheetRef={this.addToCartSheetRef}
                    {...this.props}
                  />
                </RBSheet>
              </View>
            ) : query.length > 0 ? (
              dataQueried ? (
                noProdAfterQueryResultJSX
              ) : (
                userHasNotSearchedJSX
              )
            ) : (
              userHasNotSearchedJSX
            )
          ) : (
            dataLoadingJSX
          )}
        </View>
      </View>
    );
  }
}

export default ProductsResultScreen;

const customAppBarStyle = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    elevation: 0,
    flexDirection: 'row',
    paddingTop: 12,
  },
  shopShopAppBar: {
    backgroundColor: '#FFF',
    marginTop: 0,
    paddingTop: 0,
  },
  shopShopContainer: {
    flex: 1,
    marginVertical: 16,
  },
});
