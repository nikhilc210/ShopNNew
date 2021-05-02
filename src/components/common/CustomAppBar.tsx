/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Pressable,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  globalStyles,
  primaryColor,
  secondaryColor,
} from '../../style/globalStyles';
import CustomSearchComponent from './CustomSearchComponent';
import {connect} from 'react-redux';
import {changeRouteName} from '../../store/actionsAndReducers/route/actions';
import {LocationState} from '../../store/actionsAndReducers/location/reducers';
import {RouteState} from '../../store/actionsAndReducers/route/reducers';

const CustomAppBar = (props) => {
  let iconSize = 24;
  // React.useEffect(() => {
  //   if (props.routeName !== props.route.name) {
  //     console.log('Inside useEffect of customAppBar');
  //     props.changeRouteName(props.route.name);
  //   }
  // }, [props]);
  if (props.route.name === 'Home') {
    return (
      <View
        style={[customAppBarStyle.container, customAppBarStyle.homeContainer]}>
        {/*<StatusBar backgroundColor={primaryColor} />*/}
        <View style={{flex: 1, marginStart: 16}}>
          <TouchableWithoutFeedback onPress={() => props.toggleFilter()}>
            <Image
              source={require('../../assets/filter_icon.png')}
              style={{
                width: iconSize,
                height: iconSize,
                tintColor: '#fff',
                marginHorizontal: 4,
              }}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={customAppBarStyle.titleImageContainer}>
          <Image
            style={customAppBarStyle.titleImage}
            source={require('../../assets/splash.png')}
            resizeMode={'contain'}
          />
        </View>
        <View style={customAppBarStyle.headerButton}>
          <TouchableWithoutFeedback
            onPress={() =>
              props.navigation.navigate('ShoppingCart', {
                userLocation: props.userLocation,
              })
            }>
            <Image
              source={require('../../assets/shopping_cart_icon.png')}
              style={{
                width: iconSize,
                height: iconSize,
                tintColor: '#FFFFFF',
              }}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
      // </SafeAreaView>
    );
  } else if (props.route.name === 'Profile') {
    return (
      <View
        style={[customAppBarStyle.container, customAppBarStyle.generalAppBar]}>
        <View style={customAppBarStyle.profileTitleContainer}>
          <Text style={[globalStyles.normalTitle, customAppBarStyle.titleText]}>
            Profile
          </Text>
        </View>
        <View style={customAppBarStyle.closeButton}>
          <TouchableWithoutFeedback
            onPress={() => {
              // console.log(props.navigation.canGoBack());
              if (props.navigation.canGoBack()) {
                // console.log('can go back');
                props.navigation.goBack();
              } else {
                // console.log('else');
                props.navigation.navigate('Home');
              }
            }}>
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  } else if (
    props.route.name === 'ShopShop' ||
    props.route.name === 'Products'
  ) {
    let iconColor = '#000000';
    return (
      <View
        style={[customAppBarStyle.container, customAppBarStyle.shopShopAppBar]}>
        <View style={{marginHorizontal: 4, justifyContent: 'center'}}>
          <TouchableWithoutFeedback onPress={() => props.navigation.pop()}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={iconSize}
              color={iconColor}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={customAppBarStyle.shopShopContainer}>
          <Pressable
            onPress={() => {
              props.navigation.navigate('ProductSearchResults', {
                shop: props.route.params.shop,
              });
            }}>
            <CustomSearchComponent pointerEvents={'none'} editable={false} />
          </Pressable>
        </View>
      </View>
    );
  } else if (props.route.name === 'ShoppingCart') {
    return (
      <View style={[customAppBarStyle.cartStyle]}>
        <View style={{flex: 1, marginStart: 6, justifyContent: 'center'}}>
          <TouchableWithoutFeedback onPress={() => props.navigation.pop()}>
            <MaterialIcons name="keyboard-arrow-left" size={30} color="white" />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flex: 1,
            // marginStart: 24,
            marginVertical: 16,
            backgroundColor: secondaryColor,
          }}>
          <Text
            style={[
              globalStyles.normalTitle,
              customAppBarStyle.titleText,
              {textAlign: 'center'},
            ]}>
            Cart
          </Text>
        </View>
        <View style={{flex: 1}} />
      </View>
    );
  } else if (props.route.name === 'OrderDetails') {
    return (
      <View
        style={[customAppBarStyle.container, customAppBarStyle.generalAppBar]}>
        <View style={{flex: 1, marginStart: 6, justifyContent: 'center'}}>
          <TouchableWithoutFeedback onPress={() => props.navigation.pop()}>
            <MaterialIcons name="keyboard-arrow-left" size={30} color="white" />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
            marginVertical: 16,
            backgroundColor: primaryColor,
          }}>
          <Text
            style={[
              globalStyles.normalTitle,
              customAppBarStyle.titleText,
              {textAlign: 'center'},
            ]}>
            {props.title}
          </Text>
        </View>
        <View style={{flex: 1}} />
      </View>
    );
  } else if (props.route.name === 'Orders') {
    return (
      <View
        style={[customAppBarStyle.container, customAppBarStyle.generalAppBar]}>
        <View style={{flex: 1}} />
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
            // marginStart: 24,
            marginVertical: 16,
            backgroundColor: secondaryColor,
          }}>
          <Text
            style={[
              globalStyles.normalTitle,
              customAppBarStyle.titleText,
              {textAlign: 'center'},
            ]}>
            {'Orders'}
          </Text>
        </View>
        <View style={{flex: 1}} />
      </View>
    );
  } else {
    return (
      <View
        style={[customAppBarStyle.container, customAppBarStyle.generalAppBar]}>
        <View style={{marginStart: 6, justifyContent: 'center', flex: 1}}>
          <TouchableWithoutFeedback onPress={() => props.navigation.pop()}>
            <MaterialIcons name="keyboard-arrow-left" size={30} color="white" />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
            // marginStart: 24,
            marginVertical: 16,
            backgroundColor: secondaryColor,
          }}>
          <Text
            style={[
              globalStyles.normalTitle,
              customAppBarStyle.titleText,
              {textAlign: 'center'},
            ]}>
            {props.title !== undefined ? props.title : ''}
          </Text>
        </View>
        <View style={{flex: 1}} />
      </View>
    );
  }
};

function mapStateToProps(state: {location: LocationState; route: RouteState}) {
  return {
    userLocation: state.location.userLocation,
    routeName: state.route.routeName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeRouteName: (routeName) => dispatch(changeRouteName(routeName)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomAppBar);

const customAppBarStyle = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    elevation: 0,
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios' ? 0 : 12,
  },
  homeContainer: {
    backgroundColor: secondaryColor,
    elevation: 0,
    flexDirection: 'row',
    // paddingVertical: 6,
    // paddingTop: 12,
    //   paddingTop: Platform.OS === 'ios' ? 0 : 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : StatusBar.currentHeight / 2,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  generalAppBar: {
    backgroundColor: secondaryColor,
    paddingTop: Platform.OS === 'ios' ? 0 : 6,
  },
  cartStyle: {
    elevation: 0,
    flexDirection: 'row',
    backgroundColor: secondaryColor,
    alignItems: 'center',
    alignContent: 'center',
  },
  shopShopAppBar: {backgroundColor: '#FFFFFF', marginTop: 0, paddingTop: 0},
  titleImageContainer: {
    flex: 1,
    // marginStart: 16,
    alignItems: 'center',
    alignContent: 'center',
  },
  title: {
    width: 144,
    height: 32,
    alignContent: 'center',
    alignItems: 'center',
  },
  titleImage: {
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').height * 0.05,
    alignContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    lineHeight: 21,
    fontSize: 21,
    color: 'white',
    justifyContent: 'flex-end',
  },
  headerButton: {
    flex: 1,
    color: '#FFE',
    justifyContent: 'center',
    marginEnd: 16,
    alignItems: 'flex-end',
  },
  overflowButton: {
    color: '#FFE',
    justifyContent: 'center',
    marginHorizontal: 4,
    alignItems: 'flex-end',
  },
  profileTitleContainer: {
    flex: 1,
    marginStart: 24,
    marginVertical: 16,
    backgroundColor: secondaryColor,
  },
  shopShopContainer: {
    flex: 1,
    marginVertical: 16,
  },
  closeButton: {
    flex: 1,
    color: '#FFE',
    justifyContent: 'center',
    paddingEnd: 20,
    alignItems: 'flex-end',
  },
});
