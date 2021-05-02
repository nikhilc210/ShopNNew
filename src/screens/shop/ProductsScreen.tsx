/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import CustomAppBar from '../../components/common/CustomAppBar';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ProductComponent from '../../components/productsScreen/ProductComponent';
import {normalRoundness, primaryColor} from '../../style/globalStyles';
import {TransformedShop} from '../../store/types/shop';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ProductsScreenTabBar({state, descriptors, navigation, position}) {
  return (
    <View style={{backgroundColor: '#FFFFFF'}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 4}}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // const inputRange = state.routes.map((_, i) => i);
          // const opacity = Animated.interpolate(position, {
          //   inputRange,
          //   outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
          // });

          const itemBgColor = isFocused ? primaryColor : '#FFFFFF';
          const itemBorderColor = isFocused ? primaryColor : '#BCBCBC';
          const textColor = isFocused ? '#FFFFFF' : primaryColor;

          return (
            <View
              key={index.toString()}
              style={{
                marginHorizontal: 4,
                marginVertical: 8,
              }}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 6,
                  backgroundColor: itemBgColor,
                  borderWidth: 1,
                  borderColor: itemBorderColor,
                  borderRadius: normalRoundness,
                }}>
                <Text
                  style={{
                    flexWrap: 'nowrap',
                    alignSelf: 'center',
                    color: textColor,
                  }}>
                  {label}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default class ProductsScreen extends React.Component<
  {
    route: {
      params: {
        subCategories: any;
        shop: TransformedShop;
      };
    };
  },
  {
    subCategoryList: {
      id: number;
      name: string;
    }[];
  }
> {
  constructor(props) {
    super(props);
    const subCategories = this.props.route.params.subCategories;
    this.state = {
      subCategoryList: subCategories,
    };
  }
  render() {
    return (
      <View style={[{flex: 1}]}>
        <CustomAppBar {...this.props} />
        <Tab.Navigator
          backBehavior="none"
          swipeEnabled={true}
          tabBarOptions={{
            scrollEnabled: true,
            activeTintColor: '#FFFFFF',
            allowFontScaling: false,
            labelStyle: {
              flex: 1,
              flexWrap: 'nowrap',
              fontSize: 12,
              backgroundColor: '#fff',
              color: '#000',
              borderWidth: 1,
              borderRadius: normalRoundness,
              paddingHorizontal: 4,
              textAlignVertical: 'center',
            },
            indicatorStyle: {
              borderBottomColor: 'white',
              borderBottomWidth: 0,
            },
            style: {
              // backgroundColor: "powderblue",
              // borderWidth: 1,
              // borderRadius: 10,
            },
          }}
          tabBar={(props) => <ProductsScreenTabBar {...props} />}>
          {this.state.subCategoryList.map((subCategory) => (
            <Tab.Screen
              key={subCategory.id.toString()}
              name={subCategory.name}
              // component={}
            >
              {(props) => (
                <ProductComponent
                  {...props}
                  shop={this.props.route.params.shop}
                  subCategory={subCategory}
                />
              )}
            </Tab.Screen>
          ))}
        </Tab.Navigator>
      </View>
    );
  }
}
