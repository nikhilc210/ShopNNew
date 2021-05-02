import React, {Component} from 'react';
// import ShopNLogo from '../../assets/ShopN_Splash.png';
// import UKLogo from '../../assets/UKFlag.png';
import {
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  StatusBar,
} from 'react-native';
// import RBSheet from 'react-native-raw-bottom-sheet';
import {
  globalStyles,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import {TextInput} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class LegacyAddressScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
          backgroundColor: 'white',
        }}>
        <View
          style={{flex: 1, paddingHorizontal: 12, backgroundColor: 'white'}}>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: '#BCBCBC',
              marginBottom: 12,
              backgroundColor: 'white',
            }}>
            <Text
              style={[
                globalStyles.normalTitle,
                {fontSize: 18, marginBottom: 12},
              ]}>
              Set up Account
            </Text>
          </View>
          <View
            style={{
              marginTop: 12,
              paddingTop: 8,
              borderRadius: normalRoundness,
              flexDirection: 'row',
            }}>
            {/*<Text>Name</Text>*/}
            <MaterialIcons size={40} name="location-on" />
            <TextInput
              style={addressStyles.accountDetailsInputStyle}
              placeholder="Enter a new address"
            />
          </View>
          <View
            style={{
              marginTop: 12,
              paddingTop: 8,
              borderRadius: normalRoundness,
              flexDirection: 'row',
            }}>
            {/*<Text>Email Address</Text>*/}
            <Image
              source={require('../../assets/location_arrow.png')}
              style={{width: 32, height: 32, marginRight: 8}}
            />
            <TextInput
              placeholder="Set current Location"
              style={addressStyles.accountDetailsInputStyle}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: primaryColor,
            marginHorizontal: 20,
            marginBottom: 20,
          }}>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={() => this.props.navigation.navigate('HomeBottomNav')}>
            <View style={{alignContent: 'center', paddingVertical: 8}}>
              <Text
                style={[
                  globalStyles.normalTitle,
                  {textAlign: 'center', color: '#FFF'},
                ]}>
                Next
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}
const addressStyles = StyleSheet.create({
  accountDetailsInputStyle: {
    flex: 1,
    marginBottom: 4,
    paddingHorizontal: 12,
    marginTop: 6,
    borderRadius: normalRoundness,
    height: 36,
    borderColor: 'gray',
    borderWidth: 0.5,
    backgroundColor: 'white',
  },
  addressDetails: {
    marginBottom: 4,
    paddingHorizontal: 12,
    marginTop: 6,
    borderRadius: normalRoundness,
    height: 36,
    borderColor: 'gray',
    borderWidth: 0.5,
    backgroundColor: 'white',
  },
});
