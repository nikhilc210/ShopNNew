/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {
  globalStyles,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import {RadioButton} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomDivider from '../../components/common/CustomDivider';
import {
  calculateDistanceFromShop,
  calculateStatus,
} from '../../utils/ShopSupportFunctions';

const filter = {grocery: 'Grocery', pharmacy: 'Pharmacy', butcher: 'Butchery'};
const sort = {
  distance: 'distance',
  deliveryFee: 'deliveryFee',
  openStatus: 'openStatus',
  ratings: 'ratings',
};
const FilterSheetRefined = (props) => {
  /**
   * This array can be used for multiple shop select in filter
   *
   * const [selectedFilters, setSelectedFilters] = React.useState([
   * {
   *    category: filter.grocery,
   *    selected: true,
   *  },
   * {
   *    category: filter.pharmacy,
   *    selected: true,
   *  },
   * {
   *    category: filter.butcher,
   *    selected: true,
   *  },
   * ]);
   *
   * */

  const [selectedFilter, setSelectedFilter] = React.useState(filter.grocery);
  const [selectedSort, setSortMethod] = React.useState(sort.distance);
  let iconSize = 24;
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}>
        <Text
          style={[
            globalStyles.normalTitle,
            {
              color: primaryColor,
              marginStart: 20,
            },
          ]}>
          Filters
        </Text>
        <View
          style={{
            color: '#FFE',
            justifyContent: 'center',
            paddingEnd: 20,
          }}>
          <TouchableWithoutFeedback onPress={() => props.closeSheet()}>
            <MaterialIcons name="close" size={24} color={primaryColor} />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          marginTop: 16,
          flex: 1,
          borderTopLeftRadius: normalRoundness,
          borderTopRightRadius: normalRoundness,
          paddingTop: 32,
        }}>
        <View key="Categories" style={{width: '100%', flex: 1}}>
          <View style={{width: '100%', marginStart: 12}}>
            <Text style={[globalStyles.normalTitle, {color: primaryColor}]}>
              Categories
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 12,
              borderRadius: normalRoundness,
              marginTop: 12,
            }}>
            <TouchableWithoutFeedback
              onPress={() => setSelectedFilter(filter.grocery)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 6,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/grocery_icon.png')}
                    style={{
                      width: iconSize,
                      height: iconSize,
                    }}
                    resizeMode={'contain'}
                  />
                  <Text style={[globalStyles.normalText, {marginStart: 12}]}>
                    Grocery Stores
                  </Text>
                </View>
                <View>
                  <RadioButton
                    value={filter.grocery}
                    status={
                      selectedFilter === filter.grocery
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => setSelectedFilter(filter.grocery)}
                    color={primaryColor}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <CustomDivider />
            <TouchableWithoutFeedback
              onPress={() => setSelectedFilter(filter.pharmacy)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 6,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/pharmacy_icon.png')}
                    style={{
                      width: iconSize,
                      height: iconSize,
                    }}
                    resizeMode={'contain'}
                  />
                  <Text style={[globalStyles.normalText, {marginStart: 12}]}>
                    Pharmacy Shops
                  </Text>
                </View>
                <View>
                  <RadioButton
                    value={filter.pharmacy}
                    status={
                      selectedFilter === filter.pharmacy
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => setSelectedFilter(filter.pharmacy)}
                    color={primaryColor}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <CustomDivider />
            <TouchableWithoutFeedback
              onPress={() => setSelectedFilter(filter.butcher)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 6,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/Meat_icon.png')}
                    style={{
                      width: iconSize,
                      height: iconSize,
                    }}
                    resizeMode={'contain'}
                  />
                  <Text style={[globalStyles.normalText, {marginStart: 12}]}>
                    Butcher Shops
                  </Text>
                </View>
                <View>
                  <RadioButton
                    value={filter.butcher}
                    status={
                      selectedFilter === filter.butcher
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => setSelectedFilter(filter.butcher)}
                    color={primaryColor}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              width: '100%',
              marginStart: 12,
              marginTop: 32,
              marginBottom: 12,
            }}>
            <Text style={[globalStyles.normalTitle, {color: primaryColor}]}>
              Sort
            </Text>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 12,
              borderRadius: normalRoundness,
              marginTop: 12,
            }}>
            <TouchableWithoutFeedback
              onPress={() => setSortMethod(sort.distance)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 6,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[globalStyles.normalText, {marginStart: 12}]}>
                    Distance
                  </Text>
                </View>
                <View>
                  <RadioButton
                    value={sort.distance}
                    status={
                      selectedSort === sort.distance ? 'checked' : 'unchecked'
                    }
                    onPress={() => setSortMethod(sort.distance)}
                    color={primaryColor}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <CustomDivider />
            <TouchableWithoutFeedback
              onPress={() => setSortMethod(sort.deliveryFee)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 6,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[globalStyles.normalText, {marginStart: 12}]}>
                    Delivery Fee
                  </Text>
                </View>
                <View>
                  <RadioButton
                    value={sort.deliveryFee}
                    status={
                      selectedSort === sort.deliveryFee
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => setSortMethod(sort.deliveryFee)}
                    color={primaryColor}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <CustomDivider />
            <TouchableWithoutFeedback
              onPress={() => setSortMethod(sort.openStatus)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 6,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[globalStyles.normalText, {marginStart: 12}]}>
                    Open store
                  </Text>
                </View>
                <View>
                  <RadioButton
                    value={sort.openStatus}
                    status={
                      selectedSort === sort.openStatus ? 'checked' : 'unchecked'
                    }
                    onPress={() => setSortMethod(sort.openStatus)}
                    color={primaryColor}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <CustomDivider />
            <TouchableWithoutFeedback
              onPress={() => setSortMethod(sort.ratings)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 6,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[globalStyles.normalText, {marginStart: 12}]}>
                    Ratings
                  </Text>
                </View>
                <View>
                  <RadioButton
                    value={sort.ratings}
                    status={
                      selectedSort === sort.ratings ? 'checked' : 'unchecked'
                    }
                    onPress={() => setSortMethod(sort.ratings)}
                    color={primaryColor}
                  />
                </View>
              </View>
              {/*<CustomDivider />*/}
            </TouchableWithoutFeedback>
          </View>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            let selectedShopsCategory = props.shops.filter(
              (shop) => shop.category === selectedFilter,
            );
            let selectedShops = selectedShopsCategory;
            if (selectedSort === sort.distance) {
              selectedShops.sort(function (a, b) {
                return (
                  calculateDistanceFromShop(props.userLocation, a.location)
                    .distance -
                  calculateDistanceFromShop(props.userLocation, b.location)
                    .distance
                );
              });
            } else if (selectedSort === sort.deliveryFee) {
              //Ascending Sort
              selectedShops.sort(function (a, b) {
                return a.deliveryCharge - b.deliveryCharge;
              });

              //Descending Sort
              // selectedShops.sort(function(a, b){return a.deliveryCharge - b.deliveryCharge});
            } else if (selectedSort === sort.ratings) {
              //Ascending Sort
              selectedShops.sort(function (a, b) {
                let aR = a.ratingsCount === null ? 0 : a.ratingsCount;
                let bR = b.ratingsCount === null ? 0 : b.ratingsCount;
                return aR - bR;
              });

              //Descending Sort
              // selectedShops.sort(function(a, b){return a.ratingsCount - b.ratingsCount});
            } else if (selectedSort === sort.openStatus) {
              selectedShops = selectedShops.filter(
                (shop) =>
                  calculateStatus({
                    opening_time: shop.openTimings.opening_time,
                    closing_time: shop.openTimings.closing_time,
                  }) === 'O',
              );
            }

            props.closeSheet();
            props.navigation.navigate('FilterResults', {
              toDo: 'S',
              shopCategory: selectedFilter,
              sortedShops: selectedShops,
            });
          }}>
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              backgroundColor: primaryColor,
              width: '94%',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              paddingVertical: 12,
              borderRadius: normalRoundness,
            }}>
            <Text style={[globalStyles.normalText, {color: 'white'}]}>
              Apply filter
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};
function mapStateToProps(state) {
  return {
    shops: state.shops.shops,
    userLocation: state.location.userLocation,
  };
}

export default connect(mapStateToProps)(FilterSheetRefined);
