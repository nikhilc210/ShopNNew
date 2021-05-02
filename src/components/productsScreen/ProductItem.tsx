import * as React from 'react';
import {
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import {
  globalStyles,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import {Product} from '../../store/types/product';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export class ProductItem extends React.Component<{
  currentProduct: Product;
  selectedProd: Product;
  selectProduct: Function;
  toggleSheet: Function;
}> {
  constructor(props) {
    super(props);
  }

  render() {
    const product = this.props.currentProduct;
    // console.log(product.price);
    const isSelected =
      this.props.currentProduct.productId ===
      this.props.selectedProd?.productId;
    return (
      <View
        style={{
          alignSelf: 'center',
          // backgroundColor: 'red',
          width: windowWidth * 0.5,
        }}>
        <TouchableWithoutFeedback
          onPress={() => this.props.selectProduct(product)}>
          <View
            style={{
              alignItems: 'center',
              paddingHorizontal: windowWidth * 0.07,
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
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={[
                globalStyles.normalText,
                {marginTop: 6, textAlign: 'center'},
              ]}>
              {product.productName}
            </Text>
            <Text style={[globalStyles.boldText, {marginTop: 2}]}>
              £{product.price.toString()}
            </Text>
            {isSelected && (
              <View
                style={{
                  backgroundColor: primaryColor,
                  marginTop: 4,
                  paddingHorizontal: 4,
                  borderRadius: normalRoundness,
                }}>
                <TouchableWithoutFeedback
                  style={{flex: 1}}
                  onPress={() => {
                    this.props.toggleSheet();
                  }}>
                  <View
                    style={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                    }}>
                    <Text
                      style={[
                        globalStyles.normalText,
                        {textAlign: 'center', color: 'white'},
                      ]}>
                      Add to Cart
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
