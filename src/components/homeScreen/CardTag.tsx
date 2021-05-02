import * as React from 'react';
import {View, Text} from 'react-native';
import {normalRoundness} from '../../style/globalStyles';

export default class CardTag extends React.Component<
  {
    containerStyle?: any;
    icon: any;
    text: any;
  },
  {}
> {
  render() {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            backgroundColor: '#DCDCDC',
            borderRadius: normalRoundness,
            paddingHorizontal: 8,
            paddingVertical: 2,
            marginHorizontal: 2,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          },
          this.props.containerStyle !== undefined
            ? this.props.containerStyle
            : {},
        ]}>
        {this.props.icon()}
        {this.props.text()}
      </View>
    );
  }
}
