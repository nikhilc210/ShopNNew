/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Component} from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {
  globalStyles,
  normalRoundness,
  primaryColor,
  secondaryColor,
} from '../../style/globalStyles';
import CustomAppBar from '../../components/common/CustomAppBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomDivider from '../../components/common/CustomDivider';
import {connect} from 'react-redux';
import {logout} from '../../store/actionsAndReducers/auth/actions';
import RBSheet from 'react-native-raw-bottom-sheet';
import AddressSheet from '../utility/AddressSheet';
import ContactScreen from '../utility/ContactSheet';
import {GoogleSignin} from '@react-native-community/google-signin';
import CustomActivityIndicator from '../../components/common/CustomActivityIndicator';
import {appVersion} from '../../utils/config';
import {
  cookiesPolicy,
  privacyPolicy,
  termsAndConditions,
} from '../../utils/links';

const GOOGLE_PACKAGE_NAME = 'com.itechanalogy.shopn.user.app';
const APPLE_STORE_ID = '1542049231';

class BottomSheetComponent extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isLoggingOut: false,
    };
  }
  async handleLogout() {
    this.setState({isLoggingOut: true});
    try {
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
    } catch (exception) {
      console.log(exception);
    }
    this.setState({isLoggingOut: false});
    this.props.logout();
  }
  render() {
    const {user} = this.props.auth;
    return (
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 16,
          backgroundColor: '#efefef',
          // flex: 1,
          width: '100%',
          minHeight: '95%',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignItems: 'center',
            alignContent: 'center',
            marginVertical: 12,
            marginBottom: 40,
          }}>
          {/* @ts-ignore */}
          <Avatar.Image
            source={{
              uri: user.imgUrl,
            }}
            size={90}
            style={{marginBottom: 12, backgroundColor: '#efefef'}}
          />
          <Text style={[globalStyles.normalTitle]}>{user.name}</Text>
        </View>
        <View style={profileScreenStyle.itemContainer}>
          <TouchableWithoutFeedback
            onPress={() => this.props.openAddressSheet()}
            style={profileScreenStyle.touchableItem}>
            <View style={profileScreenStyle.item}>
              <Text style={[globalStyles.lightText]}>Address</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
          <CustomDivider style={{marginHorizontal: 6}} />
          <TouchableWithoutFeedback
            onPress={() => this.props.openContactSheet()}
            style={profileScreenStyle.touchableItem}>
            <View style={profileScreenStyle.item}>
              <Text style={[globalStyles.lightText]}>Contact</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={profileScreenStyle.itemContainer}>
          <TouchableWithoutFeedback
            style={profileScreenStyle.touchableItem}
            onPress={async () => {
              const canOpenUrl = await Linking.canOpenURL(privacyPolicy);
              if (canOpenUrl) {
                await Linking.openURL(privacyPolicy);
              } else {
                Alert.alert(
                  'Kindly visit our website',
                  'To view our privacy policy, you can visit our website @: shopn.uk',
                );
              }
            }}>
            <View style={profileScreenStyle.item}>
              <Text style={[globalStyles.lightText]}>Privacy Policy</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
          <CustomDivider style={{marginHorizontal: 6}} />
          <TouchableWithoutFeedback
            style={profileScreenStyle.touchableItem}
            onPress={async () => {
              const canOpenUrl = await Linking.canOpenURL(cookiesPolicy);
              if (canOpenUrl) {
                await Linking.openURL(cookiesPolicy);
              } else {
                Alert.alert(
                  'Kindly visit our website',
                  'To view our Cookies policy, you can visit our website @: shopn.uk',
                );
              }
            }}>
            <View style={profileScreenStyle.item}>
              <Text style={[globalStyles.lightText]}>Cookies Policy</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
          <CustomDivider style={{marginHorizontal: 6}} />
          <TouchableWithoutFeedback
            style={profileScreenStyle.touchableItem}
            onPress={async () => {
              const canOpenUrl = await Linking.canOpenURL(termsAndConditions);
              if (canOpenUrl) {
                await Linking.openURL(termsAndConditions);
              } else {
                Alert.alert(
                  'Kindly visit our website',
                  'To view our Terms & Conditions, you can visit our website @: shopn.uk',
                );
              }
            }}>
            <View style={profileScreenStyle.item}>
              <Text style={[globalStyles.lightText]}>Terms & Conditions</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
          {/*<CustomDivider style={{marginHorizontal: 6}} />*/}
          {/*<TouchableWithoutFeedback*/}
          {/*  style={profileScreenStyle.touchableItem}*/}
          {/*  onPress={() => props.navigation.navigate('ReturnPolicy')}>*/}
          {/*  <View style={profileScreenStyle.item}>*/}
          {/*    <Text style={[globalStyles.lightText, {fontSize: 14}]}>*/}
          {/*      Return Policy*/}
          {/*    </Text>*/}
          {/*    <MaterialIcons*/}
          {/*      name="keyboard-arrow-right"*/}
          {/*      size={20}*/}
          {/*      color="black"*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*</TouchableWithoutFeedback>*/}
        </View>

        <View style={profileScreenStyle.itemContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              // eslint-disable-next-line eqeqeq
              if (Platform.OS != 'ios') {
                //To open the Google Play Store
                Linking.openURL(
                  `market://details?id=${GOOGLE_PACKAGE_NAME}`,
                ).catch(() =>
                  Alert.alert('Please check for the Google Play Store'),
                );
              } else {
                //To open the Apple App Store
                Linking.openURL(
                  `itms://itunes.apple.com/in/app/apple-store/${APPLE_STORE_ID}`,
                ).catch((error) => {
                  console.log(error);
                  Alert.alert('Please review us on the App Store');
                });
              }
            }}
            style={profileScreenStyle.touchableItem}>
            <View style={profileScreenStyle.item}>
              <Text style={[globalStyles.lightText]}>Give us a rating</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={profileScreenStyle.itemContainer}>
          <TouchableWithoutFeedback
            style={profileScreenStyle.touchableItem}
            onPress={() => {
              this.handleLogout();
              // props.navigation.pop();
            }}>
            <View style={[profileScreenStyle.item, {justifyContent: 'center'}]}>
              {!this.state.isLoggingOut ? (
                <Text
                  style={[
                    globalStyles.normalText,
                    {
                      color: primaryColor,
                      justifyContent: 'center',
                      textAlign: 'center',
                      flex: 1,
                    },
                  ]}>
                  Logout
                </Text>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CustomActivityIndicator
                    style={{alignSelf: 'center'}}
                    size={'small'}
                    color={primaryColor}
                  />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            alignItems: 'center',
            alignContent: 'center',
            marginVertical: 12,
          }}>
          <Image
            style={profileScreenStyle.title}
            resizeMode={'cover'}
            source={require('../../assets/shopn_blue_transparent_background.png')}
          />
          <Text
            style={[globalStyles.normalText, {color: '#696969', fontSize: 10}]}>
            Version {appVersion}
          </Text>
        </View>
      </ScrollView>
      // </View>
    );
  }
}

class ProfileScreen extends Component<any, any> {
  private addressSheet: any;
  private contactSheet: any;
  constructor(props) {
    super(props);
  }

  render() {
    // StatusBar.setBackgroundColor(secondaryColor);

    return (
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: secondaryColor,
            borderRadius: normalRoundness,
          }}>
          <CustomAppBar {...this.props} />
          <BottomSheetComponent
            openAddressSheet={() => this.addressSheet.open()}
            openContactSheet={() => this.contactSheet.open()}
            {...this.props}
          />
          <RBSheet
            ref={(ref) => {
              this.addressSheet = ref;
            }}
            closeOnDragDown={false}
            height={Dimensions.get('window').height * 0.5}
            customStyles={{
              container: {
                borderTopLeftRadius: normalRoundness,
                borderTopRightRadius: normalRoundness,
                backgroundColor: primaryColor,
              },
              draggableIcon: {
                backgroundColor: primaryColor,
              },
            }}>
            <AddressSheet
              {...this.props}
              navigation={this.props.navigation}
              closeSheet={() => this.addressSheet.close()}
            />
          </RBSheet>
          <RBSheet
            ref={(ref) => {
              this.contactSheet = ref;
            }}
            closeOnDragDown={false}
            height={Dimensions.get('window').height * 0.5}
            customStyles={{
              container: {
                borderTopLeftRadius: normalRoundness,
                borderTopRightRadius: normalRoundness,
                backgroundColor: primaryColor,
              },
              draggableIcon: {
                backgroundColor: primaryColor,
              },
            }}>
            <ContactScreen
              {...this.props}
              navigation={this.props.navigation}
              closeSheet={() => this.contactSheet.close()}
            />
          </RBSheet>
        </View>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const profileScreenStyle = StyleSheet.create({
  itemContainer: {
    borderRadius: normalRoundness,
    backgroundColor: 'white',
    marginVertical: 6,
    marginHorizontal: 2,
    paddingHorizontal: 0,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 6,
  },
  touchableItem: {flex: 1},
  title: {
    width: '40%',
    height: '30%',
    // alignContent: 'center',
    // alignItems: 'center',
    marginBottom: 6,
  },
});
