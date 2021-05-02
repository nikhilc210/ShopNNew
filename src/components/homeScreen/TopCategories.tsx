// @ts-ignore
import * as React from 'react';
import {Component} from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import {
  globalStyles,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import {connect} from 'react-redux';

const filter = {grocery: 'Grocery', pharmacy: 'Pharmacy', butcher: 'Butchery'};

class TopCategories extends Component<any, any> {
  render() {
    let iconSize = 40;
    const {shopsRedux} = this.props;
    return (
      <>
        <Text style={[globalStyles.normalTitle, topCategoryStyles.titleStyle]}>
          Stores
        </Text>
        <View style={topCategoryStyles.rowContainer}>
          <View style={topCategoryStyles.cardContainerStyle}>
            {/* @ts-ignore */}
            <Card
              onPress={() => {
                let selectedShopsCategory = shopsRedux.filter(
                  (shop) => shop.category === filter.grocery,
                );
                this.props.navigation.navigate('FilterResults', {
                  toDo: 'S',
                  shopCategory: 'Grocery',
                  sortedShops: selectedShopsCategory,
                });
              }}
              style={topCategoryStyles.cardStyle}>
              <Card.Content style={topCategoryStyles.cardContentStyle}>
                <Image
                  source={require('../../assets/grocery_icon.png')}
                  style={[
                    {
                      width: iconSize,
                      height: iconSize,
                    },
                    topCategoryStyles.imageStyle,
                  ]}
                  resizeMode={'contain'}
                />
                <Text
                  style={[
                    globalStyles.normalText,
                    topCategoryStyles.categoryTextStyle,
                  ]}>
                  Grocery
                </Text>
              </Card.Content>
            </Card>
          </View>
          <View style={topCategoryStyles.cardContainerStyle}>
            {/* @ts-ignore */}
            <Card
              onPress={() => {
                let selectedShopsCategory = shopsRedux.filter(
                  (shop) => shop.category === filter.pharmacy,
                );
                this.props.navigation.navigate('FilterResults', {
                  toDo: 'S',
                  shopCategory: 'Pharmacy',
                  sortedShops: selectedShopsCategory,
                });
              }}
              style={topCategoryStyles.cardStyle}>
              <Card.Content style={topCategoryStyles.cardContentStyle}>
                <Image
                  source={require('../../assets/pharmacy_icon.png')}
                  style={[
                    {
                      width: iconSize,
                      height: iconSize,
                    },
                    topCategoryStyles.imageStyle,
                  ]}
                  resizeMode={'contain'}
                />
                <Text
                  style={[
                    globalStyles.normalText,
                    topCategoryStyles.categoryTextStyle,
                  ]}>
                  Pharmacy
                </Text>
              </Card.Content>
            </Card>
          </View>
          <View style={topCategoryStyles.cardContainerStyle}>
            {/* @ts-ignore */}
            <Card
              onPress={() => {
                let selectedShopsCategory = shopsRedux.filter(
                  (shop) => shop.category === filter.butcher,
                );
                this.props.navigation.navigate('FilterResults', {
                  toDo: 'S',
                  shopCategory: 'Butcher',
                  sortedShops: selectedShopsCategory,
                });
              }}
              style={topCategoryStyles.cardStyle}>
              <Card.Content style={topCategoryStyles.cardContentStyle}>
                <Image
                  source={require('../../assets/Meat_icon.png')}
                  style={[
                    {
                      width: iconSize,
                      height: iconSize,
                    },
                    topCategoryStyles.imageStyle,
                  ]}
                  resizeMode={'contain'}
                />
                <Text
                  style={[
                    globalStyles.normalText,
                    topCategoryStyles.categoryTextStyle,
                  ]}>
                  Butchery
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </>
    );
  }
}

const topCategoryStyles: {
  titleStyle: any;
  rowContainer: any;
  cardContainerStyle: any;
  cardStyle: any;
  cardContentStyle: any;
  imageStyle: any;
  categoryTextStyle: any;
} = StyleSheet.create({
  titleStyle: {marginStart: 12},
  rowContainer: {flexDirection: 'row', paddingHorizontal: 12},
  cardContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  cardStyle: {
    elevation: 4,
    marginVertical: 12,
    marginHorizontal: 6,
    borderRadius: normalRoundness,
  },
  cardContentStyle: {
    backgroundColor: primaryColor,
    // padding: 0,
    paddingTop: 24,
    borderRadius: normalRoundness,
    alignContent: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  categoryTextStyle: {color: 'white', textAlign: 'center', marginTop: 6},
});

function mapStateToProps(state) {
  return {
    shopsRedux: state.shops.shops,
  };
}

export default connect(mapStateToProps)(TopCategories);
