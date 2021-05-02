import * as React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {primaryColor} from '../../style/globalStyles';

export default class CustomActivityIndicator extends React.Component<any, any> {
  render() {
    // @ts-ignore
    return <ActivityIndicator color={primaryColor} {...this.props} />;
  }
}
