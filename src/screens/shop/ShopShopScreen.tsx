/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableHighlight,
  RefreshControl,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomAppBar from '../../components/common/CustomAppBar';
import {globalStyles} from '../../style/globalStyles';
import CustomDivider from '../../components/common/CustomDivider';
import {baseUrl} from '../../utils/config';
import {connect} from 'react-redux';
import {TransformedShop} from '../../store/types/shop';
import CustomActivityIndicator from '../../components/common/CustomActivityIndicator';
import {primaryColor} from '../../style/globalStyles';

class ShopShopScreen extends React.Component<
  {
    user: any;
    token: string;
    route: {
      params: {
        shop: TransformedShop;
      };
    };
    navigation: any;
  },
  {
    hasLoaded: boolean;
    fetching: boolean;
    categoryList: {
      id: string;
      category_name: string;
      subCategories: {id: number; name: string}[];
    }[];
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
      fetching: true,
      categoryList: [],
    };
  }

  async componentDidMount() {
    this.loadCategories();
  }
  async loadCategories() {
    try {
      // console.log(this.props.route.params.shop.id);
      const shop = this.props.route.params.shop;
      const url = baseUrl + '/shops/catlog/' + shop.id;
      const result = await fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Bearer: this.props.token,
        }),
      }).then((response) => response.json());
      // console.log(result);
      this.setState({
        hasLoaded: true,
        categoryList: result,
        fetching: false,
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.state.hasLoaded) {
      const {shop} = this.props.route.params;
      return (
        <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
          <CustomAppBar {...this.props} />
          <View style={{flex: 1, backgroundColor: '#FFF'}}>
            <Text
              style={[
                globalStyles.normalTitle,
                {
                  fontSize: 18,
                  lineHeight: 32,
                  marginVertical: 4,
                  paddingHorizontal: 12,
                  paddingBottom: 12,
                },
              ]}>
              Categories
            </Text>
            <FlatList
              data={this.state.categoryList}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 40,
              }}
              refreshControl={
                <RefreshControl
                  colors={[primaryColor, primaryColor]}
                  refreshing={this.state.fetching}
                  onRefresh={() => {
                    this.setState({fetching: true}, () => {
                      this.loadCategories();
                    });
                  }}
                />
              }
              renderItem={({item}) => (
                <TouchableHighlight
                  activeOpacity={0.9}
                  underlayColor="#DCDCDC"
                  onPress={() => {
                    // console.log(item);
                    this.props.navigation.navigate('Products', {
                      subCategories: item.subCategories,
                      shop: shop,
                    });
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                    }}>
                    <Text style={[globalStyles.normalText, {fontSize: 14}]}>
                      {item.category_name}
                    </Text>
                    <MaterialIcons
                      size={20}
                      color="black"
                      name="keyboard-arrow-right"
                    />
                  </View>
                </TouchableHighlight>
              )}
              ItemSeparatorComponent={() => (
                <CustomDivider style={{marginHorizontal: 6}} />
              )}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
          <CustomAppBar {...this.props} />
          <View style={{flex: 1, backgroundColor: '#FFF'}}>
            <Text
              style={[
                globalStyles.normalTitle,
                {
                  fontSize: 18,
                  lineHeight: 32,
                  marginVertical: 4,
                  paddingHorizontal: 12,
                  paddingBottom: 12,
                },
              ]}>
              Categories
            </Text>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <CustomActivityIndicator />
            </View>
          </View>
        </View>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    token: state.auth.auth_token,
  };
};

export default connect(mapStateToProps)(ShopShopScreen);
