/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Linking} from 'react-native';
import {
  View,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CardTag from '../../components/homeScreen/CardTag';
import {
  globalStyles,
  lightGreyColor,
  primaryColor,
} from '../../style/globalStyles';
import CustomDivider from '../../components/common/CustomDivider';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {
  calculateDistanceFromShop,
  calculateStatus,
} from '../../utils/ShopSupportFunctions';
import {TransformedShop} from '../../store/types/shop';
import {LocationState} from '../../store/actionsAndReducers/location/reducers';
import {connect} from 'react-redux';

class ShopScreen extends React.Component<
  {
    route: {
      params: {
        shop: TransformedShop;
      };
    };
    userLocation: {
      latitude: string;
      longitude: string;
    };
    navigation: any;
  },
  any
> {
  render() {
    let shop = this.props.route.params.shop;
    const status = calculateStatus(shop.openTimings, shop.shop_open);
    let statusColor = status === 'C' ? 'red' : 'green';
    let statusText = status === 'C' ? 'Closed' : 'Open';
    let deliveryColor = shop.deliveryAvailability ? '#000000' : 'red';
    let deliveryText = shop.deliveryAvailability
      ? 'Delivery fee £' + shop.deliveryCharge
      : 'No delivery available';
    let dist = calculateDistanceFromShop(
      this.props.userLocation,
      shop.location,
    );

    return (
      <View
        style={{
          flex: 1,
        }}>
        <View>
          <Image
            source={{uri: shop.backgroundImageUrl}}
            style={{width: '100%', height: 200}}
          />
          {/* <Image
            source={{uri: shop.imageUrl}}
            style={{
              width: 60,
              height: 60,
              position: 'absolute',
              top: 170,
              alignSelf: 'center',
            }}
          /> */}
          <View style={{position: 'absolute', top: 232, alignSelf: 'center'}}>
            <Text style={{textAlign: 'center'}}>{shop.shopName}</Text>
            <Text style={{textAlign: 'center', fontSize: 12, color: '#A1A1A1'}}>
              {shop.category}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            paddingTop: 18,
            paddingHorizontal: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.pop();
            }}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={30}
              color="#454545"
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 36,
              marginBottom: 12,
            }}>
            <CardTag
              icon={() => <View />}
              text={() => (
                <Text
                  style={[
                    globalStyles.lightTitle,
                    {
                      justifyContent: 'center',
                      textAlign: 'center',
                    },
                  ]}>
                  {(shop.ratingsCount === null
                    ? 0
                    : Number(shop.ratingsCount).toFixed(1)) + ' '}
                  <Image
                    source={require('../../assets/star-icon.png')}
                    style={{
                      width: 10,
                      height: 10,
                      alignSelf: 'center',
                    }}
                  />
                </Text>
              )}
            />
            <CardTag
              icon={() => <View />}
              text={() => {
                return (
                  <Text
                    style={[globalStyles.lightTitle, {color: deliveryColor}]}>
                    {deliveryText}
                  </Text>
                );
              }}
            />
            <CardTag
              icon={() => <View />}
              text={() => (
                <Text style={[globalStyles.lightTitle, {color: statusColor}]}>
                  {statusText}
                </Text>
              )}
            />
            <CardTag
              icon={() => (
                <MaterialIcons size={16} name="location-on" color="#000000" />
              )}
              text={() => (
                <Text style={[globalStyles.lightText]}>{dist.distInText}</Text>
              )}
            />
          </View>
          {/*<CustomDivider style={{marginTop: 20}} />*/}
          {/*<View style={{height: 1, backgroundColor: '#000000', marginTop: 20}}/>*/}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 18,
              // paddingHorizontal: 12,
              flexGrow: 1,
              // backgroundColor: 'red',
            }}>
            <View>
              <Text style={[globalStyles.normalTitle]}>Description</Text>
              {/*<View style={{height: 1, backgroundColor: '#000000', marginTop: 6}}/>*/}
              <CustomDivider style={{marginTop: 6}} />
              <Text
                style={[
                  globalStyles.lightText,
                  {marginTop: 6, lineHeight: 14, textAlign: 'justify'},
                ]}>
                {shop.description}
              </Text>
            </View>
            <View>
              {/*ShopShop*/}
              <View style={{marginTop: 16}}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (status === 'C') {
                      Alert.alert(
                        'Shop closed',
                        'The shop is currently closed.',
                      );
                      // this.props.navigation.navigate('ShopShop', {
                      //   shop,
                      // });
                    } else if (dist.distance / 1000 > 5) {
                      Alert.alert(
                        'Shop too far away',
                        "The shop is too far away. You won't be able shop from this shop.",
                      );
                      // this.props.navigation.navigate('ShopShop', {
                      //   shop,
                      // });
                    } else {
                      this.props.navigation.navigate('ShopShop', {
                        shop,
                      });
                    }
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={require('../../assets/shopping_cart_icon.png')}
                        style={{
                          width: 24,
                          height: 24,
                          tintColor: primaryColor,
                          // transform: [{ scaleX: -1 }],
                        }}
                      />
                      <Text
                        style={[
                          globalStyles.normalTitle,
                          {textAlignVertical: 'center', marginStart: 6},
                        ]}>
                        Shop
                      </Text>
                    </View>
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={24}
                      color={lightGreyColor}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <CustomDivider style={{marginTop: 12}} />
                {/*<View style={{height: 1, backgroundColor: '#000000', marginTop: 6}}/>*/}
              </View>

              {/*Location*/}
              <View style={{marginTop: 12}}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    // openMap({ latitude: String(this.props.route.params.userLocation.latitude), longitude: String(this.props.route.params.userLocation.longitude) });
                    const scheme = Platform.select({
                      ios: 'maps:0,0?q=',
                      android: 'geo:0,0?q=',
                    });
                    const latLng = `${shop.location.latitude},${shop.location.longitude}`;
                    const label = 'Custom Label';
                    const url = Platform.select({
                      ios: `${scheme}${label}@${latLng}`,
                      android: `${scheme}${latLng}(${label})`,
                    });
                    Linking.openURL(url);
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      {/*<MaterialIcons name="location-on" size={24} color={primaryColor} />*/}
                      <SimpleLineIcons
                        name="location-pin"
                        size={24}
                        color={primaryColor}
                      />
                      <Text
                        style={[
                          globalStyles.normalTitle,
                          {textAlignVertical: 'center', marginStart: 6},
                        ]}>
                        Location
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          globalStyles.lightText,
                          {
                            // color: lightGreyColor,
                          },
                        ]}>
                        {shop.postal_code}
                      </Text>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={24}
                        color={lightGreyColor}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <CustomDivider style={{marginTop: 12}} />
                {/*<View style={{height: 1, backgroundColor: '#000000', marginTop: 6}}/>*/}
              </View>

              {/*Contact*/}
              <View style={{marginTop: 12}}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (Linking.canOpenURL(`tel:${shop.mobile_number}`)) {
                      Linking.openURL(`tel:${shop.mobile_number}`);
                    } else {
                      Linking.openURL(`telprompt:${shop.mobile_number}`);
                    }
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <SimpleLineIcons
                        name="phone"
                        size={24}
                        color={primaryColor}
                      />
                      <Text
                        style={[
                          globalStyles.normalTitle,
                          {textAlignVertical: 'center', marginStart: 6},
                        ]}>
                        Contact
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          globalStyles.lightText,
                          {
                            // color: lightGreyColor,
                          },
                        ]}>
                        {shop.mobile_number}
                      </Text>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={24}
                        color={lightGreyColor}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <CustomDivider style={{marginTop: 12}} />
                {/*<View style={{height: 1, backgroundColor: '#000000', marginTop: 6}}/>*/}
              </View>

              {/*Opening Times*/}
              <View style={{marginTop: 12}}>
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={require('../../assets/opening_times_icon.png')}
                        style={{
                          width: 24,
                          height: 24,
                          tintColor: primaryColor,
                          // transform: [{ scaleX: -1 }],
                        }}
                      />
                      <Text
                        style={[
                          globalStyles.normalTitle,
                          {textAlignVertical: 'center', marginStart: 6},
                        ]}>
                        Open Timings
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          globalStyles.lightText,
                          {
                            // color: lightGreyColor,
                          },
                        ]}>
                        {shop.openTimings.opening_time
                          .toString()
                          .split(':')[0] +
                          ':' +
                          shop.openTimings.opening_time
                            .toString()
                            .split(':')[1]}{' '}
                        to{' '}
                        {shop.openTimings.closing_time
                          .toString()
                          .split(':')[0] +
                          ':' +
                          shop.openTimings.closing_time
                            .toString()
                            .split(':')[1]}
                      </Text>
                      <View style={{width: 24}} />
                      {/*<MaterialIcons*/}
                      {/*  name="keyboard-arrow-right"*/}
                      {/*  size={24}*/}
                      {/*  color={lightGreyColor}*/}
                      {/*/>*/}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <CustomDivider style={{marginTop: 12}} />
                {/*<View style={{height: 1, backgroundColor: '#000000', marginTop: 6}}/>*/}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state: {location: LocationState}) {
  return {
    userLocation: state.location.userLocation,
  };
}

export default connect(mapStateToProps)(ShopScreen);
