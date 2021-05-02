/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  globalStyles,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import CustomAppBar from '../../components/common/CustomAppBar';
import ShopCard from '../../components/homeScreen/ShopCard';
import TopCategories from '../../components/homeScreen/TopCategories';
import CustomSearchComponent from '../../components/common/CustomSearchComponent';
import CustomActivityIndicator from '../../components/common/CustomActivityIndicator';
import NoShops from '../../components/homeScreen/NoShops';

import {connect} from 'react-redux';
import {
  errorInFetch,
  setShops,
} from '../../store/actionsAndReducers/shops/actions';
import {TransformedShop} from '../../store/types/shop';
import {baseUrl} from '../../utils/config';
import FilterSheetRefined from './FilterSheetRefined';
import Carousel from 'react-native-snap-carousel';
import {calculateDistanceFromShop} from '../../utils/ShopSupportFunctions';
// const sheetRoundness = 32;

const itemWidth = Dimensions.get('window').width * 0.94;

const sliderDetails = [
  {
    img: require('../../assets/banners/Variety.png'),
  },
  {
    img: require('../../assets/banners/Rush.png'),
  },
];
class HomePageHeader extends React.Component<
  {
    onPress: () => void;
    props: Readonly<{
      shops: TransformedShop[];
      shopsAreLoaded: boolean;
      setShops: any;
      errorInFetch: any;
      navigation: any;
    }> &
      Readonly<{children?: React.ReactNode}>;
  },
  {
    carouselItem: any;
  }
> {
  private _carousel: any;
  constructor(props) {
    super(props);
    this.state = {
      carouselItem: null,
    };
  }
  _renderItem({item, index}) {
    return (
      <View
        key={index}
        style={{
          backgroundColor: 'transparent',
          borderRadius: normalRoundness,
          height: Dimensions.get('window').height * 0.23,
          //   width: ''
          alignContent: 'center',
        }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            alignSelf: 'center',
          }}
          resizeMode={'contain'}
          source={item.img}
        />
      </View>
    );
  }

  render() {
    return (
      <>
        <View style={homeScreenStyle.searchComponentContainer}>
          <Pressable onPress={this.props.onPress}>
            <CustomSearchComponent pointerEvents={'none'} editable={false} />
          </Pressable>
        </View>
        <TopCategories {...this.props.props} />
        <View
          style={{
            // width: '100%',
            flexDirection: 'row',
            marginHorizontal: 12,
            marginTop: 12,
            backgroundColor: 'white',
          }}>
          <Carousel
            ref={(c) => {
              this._carousel = c;
            }}
            horizontal={true}
            enableSnap={true}
            data={sliderDetails}
            renderItem={this._renderItem}
            sliderWidth={itemWidth}
            itemWidth={itemWidth}
          />
        </View>
        <View
          style={{
            width: '94%',
            flexDirection: 'row',
            marginHorizontal: 12,
            backgroundColor: '#FFF',
          }}>
          <Text
            style={[globalStyles.normalTitle, {lineHeight: 24, paddingTop: 8}]}>
            Nearby
          </Text>
        </View>
      </>
    );
  }
}

class HomepageFooterComponent extends React.Component {
  render() {
    return <NoShops />;
  }
}

class HomeScreen extends React.Component<
  {
    // Props
    shops: TransformedShop[];
    shopsAreLoaded: boolean;
    setShops: any;
    errorInFetch: any;
    navigation: any;
    userLocation: any;
    userLocationLoaded: boolean;
  },
  {
    // State
    selectedFilter: string;
    fetching: boolean;
  }
> {
  private FilterSheetRef: any;
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: '',
      fetching: false,
    };
    this.FilterSheetRef = null;
  }

  async componentDidMount() {
    await this.loadShops();
  }

  private async loadShops() {
    try {
      const url = baseUrl + '/shops/shopLocationData';
      const responseResult = await fetch(url).then((response) => {
        return response.json();
      });
      this.props.setShops(responseResult);
      if (this.props.shopsAreLoaded) {
        setTimeout(() => {
          this.setState({fetching: false});
        }, 1000);
      }
    } catch (e) {
      console.log(e);
      this.props.errorInFetch(e);
      this.setState({fetching: false});
    }
  }

  renderItem(item: TransformedShop) {
    return (
      <View>
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
  }

  render() {
    if (!this.props.shopsAreLoaded) {
      this.loadShops();
    }
    return (
      <View style={homeScreenStyle.screen}>
        <CustomAppBar
          {...this.props}
          toggleFilter={() => {
            this.FilterSheetRef.open();
          }}
        />
        <FlatList
          data={this.props.shops?.filter((shop) => {
            const {userLocation, userLocationLoaded} = this.props;
            if (userLocationLoaded) {
              return (
                calculateDistanceFromShop(userLocation, shop.location)
                  .distance /
                  1000 <=
                5
              );
            } else {
              return true;
            }
          })}
          contentContainerStyle={homeScreenStyle.scrollViewStyle}
          ListHeaderComponent={() => (
            <HomePageHeader
              onPress={() => {
                this.props.navigation.navigate('ShopSearchResults');
              }}
              props={this.props}
            />
          )}
          refreshControl={
            <RefreshControl
              colors={[primaryColor, primaryColor]}
              refreshing={this.state.fetching}
              onRefresh={() => {
                this.setState({fetching: true}, async () => {
                  this.loadShops();
                });
              }}
            />
          }
          ListEmptyComponent={() => {
            return this.props.shopsAreLoaded ? (
              <View />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <CustomActivityIndicator />
              </View>
            );
          }}
          renderItem={(item) => {
            return (
              <View key={item.item.id.toString()}>
                <ShopCard shop={item.item} navigation={this.props.navigation} />
                <View
                  style={{
                    backgroundColor: '#BCBCBC',
                    width: 1,
                    marginVertical: 3,
                  }}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={() => <HomepageFooterComponent />}
        />
        <RBSheet
          ref={(ref) => {
            this.FilterSheetRef = ref;
          }}
          closeOnDragDown={false}
          height={Dimensions.get('window').height * 0.9}
          customStyles={{
            container: {
              borderTopLeftRadius: normalRoundness,
              borderTopRightRadius: normalRoundness,
              backgroundColor: primaryColor,
            },
            draggableIcon: {
              backgroundColor: primaryColor,
            },
          }}>
          <FilterSheetRefined
            {...this.props}
            closeSheet={() => this.FilterSheetRef.close()}
            setSelectedFilter={(filter) =>
              this.setState({selectedFilter: filter})
            }
          />
        </RBSheet>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    shops: state.shops.shops,
    shopsAreLoaded: state.shops.shopsLoaded,
    userLocation: state.location.userLocation,
    userLocationLoaded: state.location.userLocationLoaded,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShops: (shops) => dispatch(setShops(shops)),
    errorInFetch: (err) => dispatch(errorInFetch(err)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const homeScreenStyle = StyleSheet.create({
  scrollViewStyle: {
    paddingBottom: '25%',
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  searchComponentContainer: {
    flex: 1,
    marginVertical: 16,
    marginHorizontal: 16,
  },
});
