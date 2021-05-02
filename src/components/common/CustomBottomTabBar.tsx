import * as React from 'react';
import {Component} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {normalRoundness, primaryColor} from '../../style/globalStyles';

const fontColor = primaryColor;
const bottomBarBackgroundColor = '#EEE';

export default class CustomBottomTabBar extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    let {state, descriptors, navigation} = this.props;
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    if (focusedOptions.tabBarVisible === false) {
      return null;
    }
    return (
      <View style={customBottomTabBarStyle.bottomTabBarContainer}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const iconColor = isFocused ? fontColor : 'black';
          const TabIcon = (size) => {
            let icon;
            switch (label) {
              case 'Home':
                icon = (
                  <MaterialIcons
                    name="home"
                    size={size.size}
                    color={iconColor}
                    solid
                  />
                );
                break;
              case 'Orders':
                icon = (
                  <Image
                    source={require('../../assets/order_icon.png')}
                    style={{
                      width: size.size,
                      height: size.size,
                      tintColor: iconColor,
                    }}
                  />
                );
                break;
              case 'Search':
                icon = (
                  <MaterialIcons
                    name="search"
                    size={size.size}
                    color={iconColor}
                  />
                );
                break;
              case 'Profile':
                icon = (
                  <MaterialIcons
                    name="person"
                    size={size.size}
                    color={iconColor}
                  />
                );
                break;
            }
            return icon;
          };
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

          const iconSize: number = 30;

          if (isFocused) {
            return (
              <View
                key={route.key}
                style={customBottomTabBarStyle.tabContainer}>
                <TouchableWithoutFeedback
                  accessibilityRole="button"
                  // accessibilityStates={isFocused ? ['selected'] : []}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={customBottomTabBarStyle.fullFlex}>
                  <View style={customBottomTabBarStyle.tabIconContainer}>
                    <TabIcon size={iconSize} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
          } else {
            return (
              <View
                key={route.key}
                style={customBottomTabBarStyle.tabContainer}>
                <TouchableWithoutFeedback
                  accessibilityRole="button"
                  // accessibilityStates={isFocused ? ['selected'] : []}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={customBottomTabBarStyle.fullFlex}>
                  <View style={customBottomTabBarStyle.tabIconContainer}>
                    <TabIcon size={iconSize} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
          }
        })}
      </View>
    );
  }
}

const customBottomTabBarStyle: {
  bottomTabBarContainer: any;
  fullFlex: any;
  tabContainer: any;
  tabIconContainer: any;
} = StyleSheet.create({
  bottomTabBarContainer: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    backgroundColor: '#EEE',
    borderRadius: normalRoundness,
    bottom: 20,
    zIndex: 1,
    position: 'absolute',
  },
  fullFlex: {flex: 1},
  tabContainer: {
    flex: 1,
    paddingVertical: 12,
    marginVertical: 6,
    backgroundColor: bottomBarBackgroundColor,
    borderRadius: 52,
  },
  tabIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
