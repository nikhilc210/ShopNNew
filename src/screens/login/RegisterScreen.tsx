/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Component} from 'react';
// import ShopNLogo from '../../assets/ShopN_Splash.png';
// import UKLogo from '../../assets/UKFlag.png';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  globalStyles,
  lightGreyColor,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {InputFieldComponent} from '../../utils/formControls';
import {
  GoogleSignin,
  statusCodes,
  User,
} from '@react-native-community/google-signin';
import {baseUrl} from '../../utils/config';
import {connect} from 'react-redux';
import {login} from '../../store/actionsAndReducers/auth/actions';
import {CustomInputComponent} from './CustomInputComponent';
import messaging from '@react-native-firebase/messaging';
import CustomActivityIndicator from '../../components/common/CustomActivityIndicator';
import {
  appleAuth,
  AppleRequestResponse,
} from '@invertase/react-native-apple-authentication';
import CustomDivider from '../../components/common/CustomDivider';
import jwt_decode from 'jwt-decode';

const emptyInputComponent: InputFieldComponent = {
  data: '',
  isProper: undefined,
};

const noUserGoogleObj = {
  user: {
    id: '',
    email: '',
    familyName: null,
    givenName: null,
    name: null,
    photo: null,
  },
  idToken: null,
  scopes: undefined,
  serverAuthCode: null,
};

class RegisterScreen extends Component<
  any,
  {
    firstName: InputFieldComponent;
    lastName: InputFieldComponent;
    email: InputFieldComponent;
    mobileNumber: InputFieldComponent;
    addressLine1: InputFieldComponent;
    addressLine2: InputFieldComponent;
    county: InputFieldComponent;
    pinCode: InputFieldComponent;
    password: InputFieldComponent;
    confirmPassword: InputFieldComponent;
    fcmToken: string;
    isRegistering: boolean;
    googleSignIn: {
      isGoogleSignIn: boolean;
      signInObj: User;
    };
    appleSignIn: {
      isAppleSignIn: boolean;
      signInObj: AppleRequestResponse;
      tryingToAppleLogin: boolean;
    };
  }
> {
  constructor(props) {
    super(props);
    const googleLoggedIn = this.props?.route?.params?.isGoogleSignedIn;
    const appleLoggedIn = this.props?.route?.params?.isAppleSignedIn;
    // console.log(googleLoggedIn);
    this.state = {
      fcmToken: '',
      isRegistering: false,
      firstName: {...emptyInputComponent},
      lastName: {...emptyInputComponent},
      email: {...emptyInputComponent},
      mobileNumber: {...emptyInputComponent},
      addressLine1: {...emptyInputComponent, isProper: true},
      addressLine2: {...emptyInputComponent, isProper: true},
      county: {...emptyInputComponent, isProper: true},
      pinCode: {...emptyInputComponent, isProper: true},
      password: {...emptyInputComponent},
      confirmPassword: {...emptyInputComponent},
      googleSignIn: {
        isGoogleSignIn: false,
        signInObj: noUserGoogleObj,
      },
      appleSignIn: {
        isAppleSignIn: false,
        signInObj: appleLoggedIn
          ? this.props?.route?.params?.appleAuthResponse
          : undefined,
        tryingToAppleLogin: false,
      },
    };
    // messaging()
    //   .getToken()
    //   .then((token) => {
    //     this.setState({fcmToken: token});
    //   })
    //   .catch((error) => console.log(error));
    if (googleLoggedIn) {
      this.googleSignIn();
    } else if (appleLoggedIn) {
      this.appleSignIn();
    }
  }
  async requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus) {
      console.log('Permission status: ', authorizationStatus);
    }
    return authorizationStatus;
  }

  async componentDidMount() {
    await this.requestUserPermission().then((authorizationStatus) => {
      if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        messaging()
          .getToken()
          .then((token) => {
            this.setState({fcmToken: token});
          })
          .catch((error) => console.log(error));
      } else {
        Alert.alert(
          'Enable notifications',
          'Please enable notifications to receive updates',
        );
      }
    });
  }
  checkNameVerification(name: {data}) {
    return name.data !== undefined && /[a-zA-Z]+$/.test(name.data);
  }

  checkMobileNoVerification() {
    const {mobileNumber} = this.state;
    return (
      mobileNumber.data !== undefined &&
      /^[0-9][0-9]{9,10}$/.test(mobileNumber.data)
    );
  }
  checkEmailVerification() {
    const {email} = this.state;
    return (
      email.data !== undefined &&
      email.data.length > 5 &&
      /^\S+@\S+\.\S+$/.test(email.data)
    );
  }

  checkPasswordVerification() {
    const {password} = this.state;
    return (
      password.data !== undefined &&
      RegExp('^[A-Za-zd0-9@$#]{5,}$').test(password.data)
    );
  }

  checkAddressLineVerification(text: string) {
    return text !== undefined && /^[ a-zA-Z0-9,-]*$/.test(text);
  }

  checkPinCodeVerification(text: string) {
    // const text = this.state.pinCode.data;
    return text !== undefined && /^([ A-Z0-9]{5,8})?$/.test(text);
  }

  async googleSignIn() {
    try {
      if (!this.state.googleSignIn.isGoogleSignIn) {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        // console.log(userInfo);
        const {user} = userInfo;
        this.setState({
          firstName: {data: user.givenName, isProper: true},
          lastName: {data: user.familyName, isProper: true},
          email: {data: user.email, isProper: true},
          googleSignIn: {
            isGoogleSignIn: true,
            signInObj: userInfo,
          },
        });
      } else {
        if (await GoogleSignin.isSignedIn()) {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        }
        this.setState({
          firstName: {data: '', isProper: undefined},
          lastName: {data: '', isProper: undefined},
          email: {data: '', isProper: undefined},
          googleSignIn: {
            isGoogleSignIn: false,
            signInObj: noUserGoogleObj,
          },
        });
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // when user cancels sign in process,
        // Alert.alert('Process Cancelled');
        // console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // when in progress already
        // Alert.alert('Chill out a little on the phone man. Let it breathe.');
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // when play services not available
        Alert.alert(
          'Play services are not available. Please update your device to the newest android version',
        );
        console.log(error);
      } else {
        // some other error
        // Alert.alert('Something else went wrong... ', error.toString());
        // console.log('Unable to log you in. Please try again after some time.');
        console.log(error);
      }
    }
  }

  async appleSignIn() {
    try {
      if (!this.state.appleSignIn.isAppleSignIn) {
        this.setState((prevState) => ({
          appleSignIn: {
            isAppleSignIn: prevState.appleSignIn.isAppleSignIn,
            signInObj: prevState.appleSignIn.signInObj,
            tryingToAppleLogin: true,
          },
        }));
        let loginResponse: AppleRequestResponse;
        if (this.state.appleSignIn.signInObj !== undefined) {
          loginResponse = this.state.appleSignIn.signInObj;
        } else {
          // performs login request
          const appleAuthRequestResponse = await appleAuth.performRequest({
            nonceEnabled: false,
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          });

          // get current authentication state for user
          const credentialState = await appleAuth.getCredentialStateForUser(
            appleAuthRequestResponse.user,
          );

          if (credentialState === appleAuth.State.AUTHORIZED) {
            // console.log('Got the authorization from apple');
            // console.log(appleAuthRequestResponse);
            loginResponse = appleAuthRequestResponse;
          } else {
            console.log('Cancelled the operation');
            this.setState((prevState) => ({
              appleSignIn: {
                isAppleSignIn: prevState.appleSignIn.isAppleSignIn,
                signInObj: prevState.appleSignIn.signInObj,
                tryingToAppleLogin: false,
              },
            }));
            return;
          }
        }
        const firstName =
          loginResponse.fullName?.givenName === null
            ? ''
            : loginResponse.fullName?.givenName;
        const lastName =
          loginResponse.fullName?.familyName === null
            ? ''
            : loginResponse.fullName?.familyName;
        const email =
          loginResponse.email === null
            ? ''
            : // @ts-ignore
              jwt_decode(loginResponse.identityToken).email;
        this.setState({
          firstName: {data: firstName, isProper: true},
          lastName: {data: lastName, isProper: true},
          email: {data: email, isProper: true},
          appleSignIn: {
            isAppleSignIn: true,
            signInObj: loginResponse,
            tryingToAppleLogin: false,
          },
        });
      } else {
        this.setState({
          firstName: {data: '', isProper: undefined},
          lastName: {data: '', isProper: undefined},
          email: {data: '', isProper: undefined},
          appleSignIn: {
            isAppleSignIn: false,
            signInObj: undefined,
            tryingToAppleLogin: false,
          },
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        firstName: {data: '', isProper: undefined},
        lastName: {data: '', isProper: undefined},
        email: {data: '', isProper: undefined},
        appleSignIn: {
          isAppleSignIn: false,
          signInObj: undefined,
          tryingToAppleLogin: false,
        },
      });
    }
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      addressLine1,
      addressLine2,
      county,
      pinCode,
      password,
      confirmPassword,
    } = this.state;

    const iconSize = 20;
    return (
      <View
        style={{
          backgroundColor: primaryColor,
        }}>
        {/* <StatusBar
          translucent={true}
          backgroundColor={'white'}
          barStyle={'dark-content'}
        /> */}
        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: '5%',
            alignItems: 'center',
            alignContent: 'center',
            borderRadius: normalRoundness,
            // paddingBottom: 20,
            height: '100%',
          }}>
          <View
            style={{
              marginTop: Dimensions.get('window').height * 0.05,
              flexDirection: 'row',
              paddingBottom: 12,
            }}>
            <View style={{flex: 1}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.pop();
                }}>
                <View>
                  <MaterialIcons
                    name={'close'}
                    color={primaryColor}
                    size={20}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{flex: 3}}>
              <Text
                style={[
                  globalStyles.normalTitle,
                  {
                    textAlign: 'center',
                    color: primaryColor,
                  },
                ]}>
                Create an Account
              </Text>
            </View>
            <View style={{flex: 1}} />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: 'white',
              alignItems: 'center',
              alignContent: 'center',
              borderRadius: normalRoundness,
              paddingBottom: Platform.OS === 'ios' ? 40 : 20,
            }}>
            {/* Apple Sign up */}
            {Platform.OS === 'ios' ? (
              <View
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: normalRoundness,
                  width: '70%',
                  marginTop: Dimensions.get('window').height * 0.03,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.appleSignIn();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        padding: 8,
                        borderRadius: normalRoundness,
                      }}>
                      <Image
                        style={{width: iconSize, height: iconSize}}
                        source={require('../../assets/apple-logo.png')}
                      />
                    </View>
                    {this.state.appleSignIn.tryingToAppleLogin ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignContent: 'center',
                          flex: 1,
                        }}>
                        <CustomActivityIndicator
                          color={'white'}
                          size={'small'}
                        />
                      </View>
                    ) : !this.state.appleSignIn.isAppleSignIn ? (
                      <Text
                        style={[
                          globalStyles.normalTitle,
                          {
                            color: '#fff',
                            textAlign: 'center',
                            flex: 1,
                          },
                        ]}>
                        Sign up with Apple
                      </Text>
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignContent: 'center',
                          flex: 1,
                          alignItems: 'center',
                        }}>
                        <MaterialIcons
                          name={'check'}
                          size={20}
                          color={'white'}
                        />
                      </View>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : null}

            {/*Google Sign up button*/}
            <View
              style={{
                backgroundColor: primaryColor,
                borderRadius: normalRoundness,
                width: '70%',
                marginTop: 12,
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.googleSignIn();
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 8,
                      borderRadius: normalRoundness,
                    }}>
                    <Image
                      style={{width: iconSize, height: iconSize}}
                      source={require('../../assets/google-logo.png')}
                    />
                  </View>
                  {!this.state.googleSignIn.isGoogleSignIn ? (
                    <Text
                      style={[
                        globalStyles.normalTitle,
                        {
                          color: '#fff',
                          textAlign: 'center',
                          flex: 1,
                        },
                      ]}>
                      Sign up with Google
                    </Text>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      <MaterialIcons name={'check'} size={20} color={'white'} />
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>

            {Platform.OS === 'ios' ? (
              <CustomDivider
                style={{
                  width: '100%',
                  marginTop: 12,
                  marginBottom: 0,
                  // backgroundColor: 'black',
                }}
              />
            ) : null}

            {/* Input Form */}
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                alignContent: 'center',
                // backgroundColor: 'purple',
                marginTop:
                  Platform.OS === 'ios'
                    ? Dimensions.get('window').height * 0.02
                    : Dimensions.get('window').height * 0.05,
              }}>
              <Text style={[globalStyles.normalTitle, styles.titleText]}>
                Personal Details
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                }}>
                <View style={{flex: 1, marginEnd: 2}}>
                  <CustomInputComponent
                    type={'text'}
                    placeholder={'First Name'}
                    errorLabel={'Invalid name'}
                    isProper={firstName.isProper}
                    onChangeText={(text) =>
                      this.setState((prevState) => ({
                        firstName: {
                          data: text,
                          isProper: prevState.firstName.isProper,
                        },
                      }))
                    }
                    value={this.state.firstName.data}
                    onEndEditing={(text) => {
                      // console.log(text.nativeEvent.text);
                      this.setState({
                        firstName: {
                          data: text.nativeEvent.text,
                          isProper: this.checkNameVerification({
                            data: text.nativeEvent.text,
                          }),
                        },
                      });
                    }}
                  />
                </View>
                <View style={{flex: 1, marginStart: 2}}>
                  <CustomInputComponent
                    type={'text'}
                    placeholder={'Last Name'}
                    errorLabel={'Invalid name'}
                    value={this.state.lastName.data}
                    isProper={lastName.isProper}
                    onChangeText={(text) =>
                      this.setState((prevState) => ({
                        lastName: {
                          data: text,
                          isProper: prevState.lastName.isProper,
                        },
                      }))
                    }
                    onEndEditing={(text) => {
                      // console.log(text);
                      this.setState({
                        lastName: {
                          data: text.nativeEvent.text,
                          isProper: this.checkNameVerification({
                            data: text.nativeEvent.text,
                          }),
                        },
                      });
                    }}
                  />
                </View>
              </View>
              <CustomInputComponent
                type={'text'}
                onChangeText={(text) =>
                  this.setState((prevState) => ({
                    email: {
                      data: text,
                      isProper: prevState.email.isProper,
                    },
                  }))
                }
                value={email.data}
                isProper={email.isProper}
                placeholder={'Email'}
                errorLabel={'Invalid Email'}
                keyboardType={'email-address'}
                onEndEditing={(text) => {
                  this.setState({
                    email: {
                      data: text.nativeEvent.text,
                      isProper: this.checkEmailVerification(),
                    },
                  });
                }}
              />
              <View style={{width: '50%', alignSelf: 'flex-start'}}>
                <CustomInputComponent
                  type={'text'}
                  onChangeText={(text) =>
                    this.setState((prevState) => ({
                      mobileNumber: {
                        data: text,
                        isProper: prevState.mobileNumber.isProper,
                      },
                    }))
                  }
                  value={mobileNumber.data}
                  isProper={mobileNumber.isProper}
                  placeholder={'Mobile number'}
                  errorLabel={'Invalid mobile number'}
                  keyboardType={'phone-pad'}
                  onEndEditing={(text) => {
                    // console.log(text.nativeEvent);
                    this.setState({
                      mobileNumber: {
                        data: text.nativeEvent.text,
                        isProper: this.checkMobileNoVerification(),
                      },
                    });
                  }}
                />
              </View>
              <Text style={[globalStyles.normalTitle, styles.titleText]}>
                Address Details (Optional)
              </Text>
              <CustomInputComponent
                type={'text'}
                onChangeText={(text) =>
                  this.setState((prevState) => ({
                    addressLine1: {
                      data: text,
                      isProper: prevState.addressLine1.isProper,
                    },
                  }))
                }
                value={addressLine1.data}
                isProper={addressLine1.isProper}
                placeholder={'Address Line 1'}
                errorLabel={'Invalid Address Line'}
                onEndEditing={(text) => {
                  // console.log(text.nativeEvent);
                  this.setState({
                    addressLine1: {
                      data: text.nativeEvent.text,
                      isProper: this.checkAddressLineVerification(
                        text.nativeEvent.text,
                      ),
                    },
                  });
                }}
              />
              <CustomInputComponent
                type={'text'}
                onChangeText={(text) =>
                  this.setState((prevState) => ({
                    addressLine2: {
                      data: text,
                      isProper: prevState.addressLine2.isProper,
                    },
                  }))
                }
                value={addressLine2.data}
                isProper={addressLine2.isProper}
                placeholder={'Address Line 2'}
                errorLabel={'Invalid Address Line'}
                onEndEditing={(text) => {
                  // console.log(text.nativeEvent);
                  this.setState({
                    addressLine2: {
                      data: text.nativeEvent.text,
                      isProper: this.checkAddressLineVerification(
                        text.nativeEvent.text,
                      ),
                    },
                  });
                }}
              />
              <View style={{width: '100%', flexDirection: 'row'}}>
                <View style={{flex: 1, marginEnd: 2}}>
                  <CustomInputComponent
                    type={'text'}
                    onChangeText={(text) =>
                      this.setState((prevState) => ({
                        county: {
                          data: text,
                          isProper: prevState.county.isProper,
                        },
                      }))
                    }
                    value={county.data}
                    isProper={county.isProper}
                    placeholder={'County'}
                    errorLabel={'Invalid County'}
                    onEndEditing={(text) => {
                      // console.log(text.nativeEvent);
                      this.setState({
                        county: {
                          data: text.nativeEvent.text,
                          isProper: true,
                        },
                      });
                    }}
                  />
                </View>
                <View style={{flex: 1, marginStart: 2}}>
                  <CustomInputComponent
                    type={'text'}
                    onChangeText={(text: string) =>
                      this.setState((prevState) => ({
                        pinCode: {
                          data: text.toUpperCase(),
                          isProper: prevState.pinCode.isProper,
                        },
                      }))
                    }
                    value={pinCode.data}
                    isProper={pinCode.isProper}
                    placeholder={'Postcode'}
                    errorLabel={'Invalid Postcode'}
                    onEndEditing={(text) => {
                      // console.log(text.nativeEvent);
                      this.setState({
                        pinCode: {
                          data: text.nativeEvent.text.toUpperCase(),
                          isProper: this.checkPinCodeVerification(
                            text.nativeEvent.text.toUpperCase(),
                          ),
                        },
                      });
                    }}
                  />
                </View>
              </View>
              {!this.state.googleSignIn.isGoogleSignIn &&
              !this.state.appleSignIn.isAppleSignIn ? (
                <>
                  <Text style={[globalStyles.normalTitle, styles.titleText]}>
                    Password
                  </Text>
                  <CustomInputComponent
                    type={'password'}
                    onChangeText={(text) =>
                      this.setState((prevState) => ({
                        password: {
                          data: text,
                          isProper: prevState.password.isProper,
                        },
                      }))
                    }
                    secureTextEntry
                    value={password.data}
                    isProper={password.isProper}
                    placeholder={'Password'}
                    errorLabel={'Invalid Password'}
                    editable={!this.state.googleSignIn.isGoogleSignIn}
                    onEndEditing={(text) => {
                      // console.log(text.nativeEvent);
                      this.setState({
                        password: {
                          data: text.nativeEvent.text,
                          isProper: this.checkPasswordVerification(),
                        },
                      });
                    }}
                  />
                  <CustomInputComponent
                    type={'password'}
                    onChangeText={(text) =>
                      this.setState((prevState) => ({
                        confirmPassword: {
                          data: text,
                          isProper: prevState.confirmPassword.isProper,
                        },
                      }))
                    }
                    secureTextEntry
                    value={confirmPassword.data}
                    isProper={confirmPassword.isProper}
                    placeholder={'Confirm password'}
                    errorLabel={'Invalid Password'}
                    editable={!this.state.googleSignIn.isGoogleSignIn}
                    onEndEditing={(text) => {
                      // console.log(text.nativeEvent);
                      this.setState({
                        confirmPassword: {
                          data: text.nativeEvent.text,
                          isProper: this.checkPasswordVerification(),
                        },
                      });
                    }}
                  />
                </>
              ) : undefined}
            </View>
            <View
              style={{
                width: '100%',
                paddingVertical: 12,
                marginTop: Dimensions.get('window').height * 0.02,
                justifyContent: 'center',
              }}>
              <Text
                style={[globalStyles.normalText, styles.nonHighlightedText]}>
                By logging into your account you agree to our{' '}
                <TouchableWithoutFeedback>
                  <Text style={[globalStyles.normalText, styles.hyperlinks]}>
                    Terms & Conditions.
                  </Text>
                </TouchableWithoutFeedback>
              </Text>
              <Text
                style={[globalStyles.normalText, styles.nonHighlightedText]}>
                Please make sure to read our{' '}
                <TouchableWithoutFeedback>
                  <Text style={[globalStyles.normalText, styles.hyperlinks]}>
                    Cookies Policy{' '}
                  </Text>
                </TouchableWithoutFeedback>
                &{' '}
                <TouchableWithoutFeedback>
                  <Text style={[globalStyles.normalText, styles.hyperlinks]}>
                    Privacy Policy.
                  </Text>
                </TouchableWithoutFeedback>
              </Text>
            </View>
            <View
              style={{
                backgroundColor: primaryColor,
                borderRadius: normalRoundness,
                width: '80%',
                paddingVertical: 12,
                marginTop: Dimensions.get('window').height * 0.01,
              }}>
              <TouchableWithoutFeedback
                disabled={this.state.isRegistering}
                onPress={() => {
                  this.registerUser();
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {!this.state.isRegistering ? (
                    <Text
                      style={[
                        globalStyles.normalText,
                        {
                          color: '#fff',
                          textAlign: 'center',
                          flex: 1,
                        },
                      ]}>
                      Create account
                    </Text>
                  ) : (
                    <CustomActivityIndicator size={'small'} color={'white'} />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  checkAllDataIsFilled() {
    const {
      firstName,
      lastName,
      email,
      password,
      mobileNumber,
      googleSignIn,
      pinCode,
      addressLine1,
      addressLine2,
      confirmPassword,
    } = this.state;
    if (googleSignIn.isGoogleSignIn) {
      return (
        firstName.isProper &&
        lastName.isProper &&
        email.isProper &&
        mobileNumber.isProper &&
        pinCode.isProper &&
        addressLine1.isProper &&
        addressLine2.isProper
      );
    }
    return (
      firstName.isProper &&
      lastName.isProper &&
      email.isProper &&
      mobileNumber.isProper &&
      pinCode.isProper &&
      addressLine1.isProper &&
      addressLine2.isProper &&
      password.isProper &&
      confirmPassword.isProper &&
      password.data === confirmPassword.data
    );
  }

  async registerUser() {
    if (this.checkAllDataIsFilled()) {
      try {
        // console.log('Sending query');
        this.setState({isRegistering: true});
        const {isGoogleSignIn, signInObj} = this.state.googleSignIn;
        const {
          isAppleSignIn,
          signInObj: appleSignInObj,
        } = this.state.appleSignIn;
        let url = baseUrl;
        if (isGoogleSignIn) {
          url += '/users/googleSignUp';
          const form = {...this.state};
          const body = {
            name: form.firstName.data + ' ' + form.lastName.data,
            mobile_no: form.mobileNumber.data,
            email: form.email.data,
            password: form.password.data,
            address: [
              {
                line_1: form.addressLine1.data,
                line_2: form.addressLine2.data,
                pinCode: form.pinCode.data,
                county: form.county?.data,
              },
            ],
          };
          const registrationResponse = await fetch(url, {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(body),
          });
          if (registrationResponse.ok) {
            const loginUrl = baseUrl + '/users/googleSignIn';
            // console.log(form.fcmToken);
            const loginBody = {
              token: signInObj.idToken,
              fcmToken: form.fcmToken,
            };
            const loginResponse = await fetch(loginUrl, {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              body: JSON.stringify(loginBody),
            });
            if (loginResponse.ok) {
              const loginResponseJSON = await loginResponse.json();
              this.setState({isRegistering: false});
              this.props.login(
                loginResponseJSON.jwtAccessToken,
                loginResponseJSON.user,
              );
            }
          }
        } else if (isAppleSignIn) {
          url += '/users/appleSignUp';
          const form = {...this.state};
          const body = {
            name: form.firstName.data + ' ' + form.lastName.data,
            mobile_no: form.mobileNumber.data,
            email: form.email.data,
            password: form.password.data,
            address: [
              {
                line_1: form.addressLine1.data,
                line_2: form.addressLine2.data,
                pinCode: form.pinCode.data,
                county: form.county?.data,
              },
            ],
          };

          const registrationResponse = await fetch(url, {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(body),
          });
          if (registrationResponse.ok) {
            const loginUrl = baseUrl + '/users/appleSignIn';
            // console.log(form.fcmToken);
            const loginBody = {
              idToken: appleSignInObj.identityToken,
              nonce: appleSignInObj.nonce,
              fcmToken: form.fcmToken,
            };
            const loginResponse = await fetch(loginUrl, {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              body: JSON.stringify(loginBody),
            });
            if (loginResponse.ok) {
              const loginResponseJSON = await loginResponse.json();
              this.setState({isRegistering: false});
              this.props.login(
                loginResponseJSON.jwtAccessToken,
                loginResponseJSON.user,
              );
            }
          }
        } else {
          url += '/users/signUp';
          const form = {...this.state};
          const body = {
            name: form.firstName.data + ' ' + form.lastName.data,
            mobile_no: form.mobileNumber.data,
            email: form.email.data,
            password: form.password.data,
            address: [
              {
                line_1: form.addressLine1.data,
                line_2: form.addressLine2.data,
                pinCode: form.pinCode.data,
                county: form.county.data,
              },
            ],
          };
          // console.log(url);
          // console.log(body);
          const registrationResponse = await fetch(url, {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(body),
          });
          // console.log('After registration');
          // console.log(registrationResponse);
          if (registrationResponse.ok) {
            // console.log('Registration was successful');
            const loginUrl = baseUrl + '/users/login';
            const loginBody = {
              email: form.email.data,
              password: form.password.data,
              fcmToken: form.fcmToken,
            };
            // console.log(loginBody);
            const loginResponse = await fetch(loginUrl, {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              body: JSON.stringify(loginBody),
            });
            if (loginResponse.ok) {
              const loginResponseJSON = await loginResponse.json();
              // console.log(loginResponseJSON);
              this.setState({isRegistering: false});
              this.props.login(
                loginResponseJSON.jwtAccessToken,
                loginResponseJSON.user,
              );
            } else {
              this.setState({isRegistering: false});
              Alert.alert(
                'Error in logging in: ' + loginResponse.status,
                "You've been registered but couldn't log you in. Please try logging in after some time.",
              );
            }
          } else {
            this.setState({isRegistering: false});
            Alert.alert(
              'Error in Registering: ' + registrationResponse.status,
              'Unable to register you. Please try again later',
            );
          }
        }
      } catch (e) {
        console.log(e);
        this.setState({isRegistering: false});
        Alert.alert(
          'Error while trying to register',
          'Error in registering. Please try again after some time',
        );
      }
    } else {
      Alert.alert('Please fill all data correctly');
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: (jwtToken, loginResponse) =>
      dispatch(login(jwtToken, loginResponse)),
  };
}

export default connect(null, mapDispatchToProps)(RegisterScreen);

const styles = StyleSheet.create({
  accountDetailsInputStyle: {
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
  buttonTextStyle: {
    color: '#fff',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  buttonContainer: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primaryColor,
  },
  normalInput: {
    // flex: 1,
    height: 40,
    width: '100%',
    paddingHorizontal: 12,
    borderColor: lightGreyColor,
    borderRadius: normalRoundness,
    borderWidth: 1,
  },
  wrongInput: {
    // flex: 1,
    height: 40,
    width: '100%',
    paddingHorizontal: 12,
    borderColor: primaryColor,
    borderRadius: normalRoundness,
    borderWidth: 1,
  },
  inputContainer: {
    width: '100%',
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'justify',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'justify',
    // backgroundColor: 'red',
  },
  hyperlinks: {
    color: primaryColor,
    lineHeight: 14,
  },
  nonHighlightedText: {textAlign: 'justify', lineHeight: 14},
  titleText: {
    textAlign: 'justify',
    // backgroundColor: 'red',
    alignSelf: 'flex-start',
    marginBottom: 12,
    color: primaryColor,
  },
});

// const form = {
//   firstName: {data: 'Mustanseer'},
//   lastName: {data: 'Sakerwala'},
//   mobileNumber: {data: '8490011343'},
//   password: {data: 'DemoPass'},
//   email: {data: 'smustanseer@gmail.com'},
//   addressLine1: {data: 'Demo Pass'},
//   addressLine2: {data: 'DemoPass'},
//   pinCode: {data: '345DWT'},
//   county: {data: 'Vakinka'},
// };
