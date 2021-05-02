/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, TouchableWithoutFeedback, Text} from 'react-native';
import {primaryColor} from '../../style/globalStyles';

export default function OrdersTabLayout({
  state,
  descriptors,
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  position,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: 12,
        paddingBottom: 12,
        textAlign: 'center',
        justifyContent: 'center',
      }}>
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

        let highlightedStyle = {
          color: primaryColor,
          textDecorationColor: primaryColor,
          textDecorationLine: 'underline',
          fontSize: 14,
          textAlign: 'center',
        };
        let nonHighlightedTextStyle = {
          fontSize: 14,
          color: 'black',
          textAlign: 'center',
        };

        return (
          <View
            key={route.key}
            style={{flex: 1, textAlign: 'center', justifyContent: 'center'}}>
            <TouchableWithoutFeedback
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{flex: 1, textAlign: 'center', justifyContent: 'center'}}>
              <Text
                style={isFocused ? highlightedStyle : nonHighlightedTextStyle}>
                {label}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        );
      })}
    </View>
  );
}
