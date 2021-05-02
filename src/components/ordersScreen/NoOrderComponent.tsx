/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, Text, Image, Dimensions} from 'react-native';
import {globalStyles} from '../../style/globalStyles';
export default class NoOrderComponent extends React.Component<any, any> {
  render() {
    const imageSize = Dimensions.get('window').width * 0.2;
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          marginHorizontal: '15%',
        }}>
        <Image
          source={require('../../assets/manage_orders_icon.png')}
          style={{
            width: imageSize,
            height: imageSize * 1.4,
            alignSelf: 'center',
            marginBottom: 12,
          }}
          resizeMode={'cover'}
        />
        <Text style={[globalStyles.normalText, {textAlign: 'center'}]}>
          No Order till now
        </Text>
        <Text style={[globalStyles.normalText, {textAlign: 'center'}]}>
          Head out to any shop and get anything delivered to you in as little as
          15 mins!
        </Text>
      </View>
    );
  }
}
