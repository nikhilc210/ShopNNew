import * as React from 'react';
import {Component} from 'react';
import {StyleSheet} from 'react-native';
import {normalRoundness, globalStyles} from '../../style/globalStyles';
import {Searchbar} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

export default class CustomSearchComponent extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showCross: false,
    };
  }

  render() {
    const placeholder =
      this.props.placeholder === undefined ? 'Search' : this.props.placeholder;
    return (
      <Searchbar
        {...this.props}
        disableFullscreenUI={true}
        placeholder={placeholder}
        returnKeyType={'search'}
        style={styles.searchBarStyle}
        // @ts-ignore
        placeholderStyle={[globalStyles.lightText, styles.placeholderStyle]}
        inputStyle={[globalStyles.normalText, styles.inputStyle]}
      />
    );
  }
}

const styles = StyleSheet.create({
  searchBarStyle: {
    borderRadius: normalRoundness,
    backgroundColor: '#f1f1f1',
    elevation: 0,
    marginEnd: 12,
    borderColor: 'white',
    height: 36,
  },
  placeholderStyle: {
    color: 'red',
  },
  inputStyle: {
    fontSize: RFValue(14),
    textAlign: 'left',
    textAlignVertical: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    paddingVertical: 0,
    // backgroundColor: 'red',
  },
});
