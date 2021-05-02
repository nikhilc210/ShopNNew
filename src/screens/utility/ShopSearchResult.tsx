/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from 'react-native';
import CustomSearchComponent from '../../components/common/CustomSearchComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {TransformedShop} from '../../store/types/shop';
import {globalStyles} from '../../style/globalStyles';
import ShopCard from '../../components/homeScreen/ShopCard';

class ShopSearchResult extends Component<
  {
    shopsRedux: TransformedShop[];
    navigation: any;
    route: any;
  },
  {
    query: string;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };
  }

  render() {
    let iconSize = 24;
    let iconColor = '#000000';
    const {query} = this.state;
    const shops = this.props.shopsRedux.filter((shop) => {
      return shop.shopName.toLowerCase().includes(query.toLowerCase());
    });
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
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
              onChangeText={(text) => this.setState({query: text})}
              value={query}
            />
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: '10%',
          }}>
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
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={[globalStyles.normalText]}>
                No shops that matches the name
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
    shopsRedux: state.shops.shops,
  };
}

export default connect(mapStateToProps, null)(ShopSearchResult);

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
