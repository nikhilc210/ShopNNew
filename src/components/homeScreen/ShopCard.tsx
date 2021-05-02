/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
} from 'react-native';
// import {Card, Title, Paragraph} from 'react-native-paper';
import {
  globalStyles,
  lightGreyColor,
  normalRoundness,
} from '../../style/globalStyles';
import CardTag from './CardTag';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TransformedShop} from '../../store/types/shop';
import {
  calculateDistanceFromShop,
  calculateStatus,
} from '../../utils/ShopSupportFunctions';
import {connect} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
// import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';

class ShopCard extends React.Component<
  {
    shop: TransformedShop;
    userLocation: {
      latitude: string;
      longitude: string;
    };
    navigation: any;
  },
  any
> {
  render() {
    const {shop} = this.props;
    const status = calculateStatus(shop.openTimings, shop.shop_open);
    let statusColor = status === 'C' ? 'red' : 'green';
    let statusText = status === 'C' ? 'Closed' : 'Open';

    let deliveryColor = shop.deliveryAvailability ? '#000000' : 'red';
    let deliveryText = shop.deliveryAvailability
      ? 'Delivery fee £' + shop.deliveryCharge.toFixed(2)
      : 'No delivery available';
    let dist = calculateDistanceFromShop(this.props.userLocation, shop.location)
      .distInText;

    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: normalRoundness,
          marginHorizontal: 18,
          paddingBottom: 12,
          marginVertical: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 10,
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate('Shop', {
              shop: shop,
              userLocation: this.props.userLocation,
            });
          }}>
          <View style={{backgroundColor: 'white'}}>
            <View style={{flex: 3}}>
              <ImageBackground
                source={{uri: shop.backgroundImageUrl}}
                style={{width: '100%', height: 172, opacity: 1}}
                resizeMode={'cover'}
                imageStyle={{
                  borderTopRightRadius: normalRoundness,
                  borderTopLeftRadius: normalRoundness,
                }}
                // resizeMode="fit"
              />
              <CardTag
                containerStyle={{
                  position: 'absolute',
                  top: 8,
                  right: 4,
                  backgroundColor: lightGreyColor,
                }}
                icon={() => <View />}
                text={() => (
                  <Text
                    style={[
                      globalStyles.lightTitle,
                      {
                        color: statusColor,
                        fontSize: RFValue(10),
                      },
                    ]}>
                    {statusText}
                  </Text>
                )}
              />
            </View>
            <View style={{marginTop: 12, flex: 1}}>
              {/* <Image
                source={{uri: shop.imageUrl}}
                // resizeMode={'contain'}
                style={{
                  width: 64,
                  height: 64,
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 72,
                  // backgroundColor: 'red',
                  borderRadius: normalRoundness,
                }}
              /> */}
              <View>
                <View style={{marginVertical: 12, paddingHorizontal: 12}}>
                  <Text
                    style={[
                      globalStyles.normalTitle,
                      {color: '#000', fontSize: RFValue(12)},
                    ]}>
                    {shop.shopName}
                  </Text>
                  <Text
                    style={[
                      globalStyles.lightTitle,
                      {fontSize: RFValue(10), color: '#BCBCBC'},
                    ]}>
                    {shop.category}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                    marginHorizontal: 6,
                  }}>
                  <CardTag
                    icon={() => <View />}
                    text={() => {
                      return (
                        <Text
                          style={[
                            globalStyles.lightTitle,
                            {
                              // color: deliveryColor,
                              fontSize: RFValue(8),
                            },
                          ]}>
                          {'Min. Order Fee: £' +
                            shop.minimum_order_fee.toFixed(2)}
                        </Text>
                      );
                    }}
                  />
                  <CardTag
                    icon={() => <View />}
                    text={() => {
                      return (
                        <Text
                          style={[
                            globalStyles.lightTitle,
                            {
                              color: deliveryColor,
                              fontSize: RFValue(8),
                            },
                          ]}>
                          {deliveryText}
                        </Text>
                      );
                    }}
                  />
                  <CardTag
                    icon={() => <View />}
                    text={() => (
                      <Text
                        style={[
                          globalStyles.lightTitle,
                          {
                            justifyContent: 'center',
                            textAlign: 'center',
                            fontSize: RFValue(8),
                          },
                        ]}>
                        {shop.ratingsCount !== undefined &&
                        shop.ratingsCount !== null
                          ? shop.ratingsCount + ' '
                          : 0 + ' '}
                        <Image
                          source={require('../../assets/star-icon.png')}
                          style={{
                            width: 10,
                            height: 10,
                            alignSelf: 'center',
                            // marginHorizontal: 4
                          }}
                        />
                        {' (' +
                          (shop.reviewCount === null ||
                          shop.reviewCount === undefined
                            ? 0
                            : shop.reviewCount) +
                          ')'}
                      </Text>
                    )}
                  />
                  <CardTag
                    icon={() => (
                      <MaterialIcons
                        size={16}
                        name="location-on"
                        color="#000000"
                      />
                    )}
                    text={() => (
                      <Text
                        style={[
                          globalStyles.lightText,
                          {fontSize: RFValue(8)},
                        ]}>
                        {dist}
                      </Text>
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userLocLoaded: state.location.userLocationLoaded,
    userLocation: state.location.userLocation,
  };
}

export default connect(mapStateToProps)(ShopCard);
