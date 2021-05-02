import * as React from 'react';
import {View, Text, ScrollView} from 'react-native';
import CustomAppBar from '../../components/common/CustomAppBar';
import {connect} from 'react-redux';
import ShopCard from '../../components/homeScreen/ShopCard';
import {TransformedShop} from '../../store/types/shop';
import {globalStyles} from '../../style/globalStyles';

class FilterResultsScreen extends React.Component<
  {
    route: {
      params: {
        toDo: string;
        shopCategory?: string;
        sortedShops?: TransformedShop[];
      };
    };
    initialShops: TransformedShop[];
    userLocation: {
      latitude: string;
      longitude: string;
    };
    navigation: any;
  },
  any
> {
  constructor(props) {
    super(props);
  }
  render() {
    const {sortedShops, shopCategory} = this.props.route.params;
    // const {initialShops} = this.props;
    let shops;
    shops = sortedShops;
    let category = shopCategory;
    return (
      <View
        style={{
          flex: 1,
        }}>
        <CustomAppBar title={'Filter results'} {...this.props} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: '2%',
            paddingBottom: '10%',
          }}>
          {/*<Text style={[globalStyles.normalTitle, {marginHorizontal: 12}]}>*/}
          {/*  Showing {category.toLowerCase()} results: 1 - {shops.length} shops*/}
          {/*</Text>*/}
          {shops.map((item, index) => {
            return (
              <View key={index}>
                <ShopCard shop={item} navigation={this.props.navigation} />
                <View
                  style={{
                    backgroundColor: '#BCBCBC',
                    width: 1,
                    marginVertical: 3,
                  }}
                />
              </View>
            );
          })}
          {shops.length === 0 ? (
            <View
              style={{
                // flex: 1,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={[globalStyles.normalText]}>
                No {shopCategory} shops active at the moment
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userLocation: state.location.userLoc,
  };
}

export default connect(mapStateToProps)(FilterResultsScreen);
