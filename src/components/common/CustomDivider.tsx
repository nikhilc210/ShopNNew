import * as React from 'react';
import {View} from 'react-native';

export default class CustomDivider extends React.Component<{
  style?: any;
}> {
  render() {
    return (
      <View
        style={[{height: 1, backgroundColor: '#BCBCBC'}, this.props.style]}
      />
    );
  }
}
