/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {
  globalStyles,
  lightGreyColor,
  lightGreyTextColor,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {baseUrl} from '../../utils/config';
import {
  login,
  // LOGIN_SUCCESSFUL,
  // LOGIN_FAILED,
} from '../../store/actionsAndReducers/auth/actions';
// import {TransformedShop} from '../../store/types/shop';
import {InputFieldComponent} from '../../utils/formControls';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import CustomActivityIndicator from '../../components/common/CustomActivityIndicator';
import messaging from '@react-native-firebase/messaging';
import RBSheet from 'react-native-raw-bottom-sheet';
import ForgotPasswordSheet from './ForgotPasswordSheet';
import {Snackbar} from 'react-native-paper';
import {
  cookiesPolicy,
  privacyPolicy,
  termsAndConditions,
} from '../../utils/links';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {StackNavigationProp} from '@react-navigation/stack';

interface LoginScreenProps {
  navigation: StackNavigationProp<any>;
  tryToLogin: (jwtToken: string, user: any) => void;
  closeSheet: () => void;
  loginFailed: () => void;
  auth: any;
}

interface LoginScreenState {
  email: InputFieldComponent;
  password: InputFieldComponent;
  tryingToLogin: boolean;
  tryingToGoogleLogin: boolean;
  tryingToAppleLogin: boolean;
  fcmToken: String;
  loginFailSnackbar: boolean;
}

const emptyInputComponent: InputFieldComponent = {
  data: '',
  isProper: undefined,
};

class LoginScreen extends React.Component<LoginScreenProps, LoginScreenState> {
  private forgotPasswordSheetRef: any;
  constructor(props) {
    super(props);
    this.state = {
      loginFailSnackbar: false,
      tryingToLogin: false,
      tryingToGoogleLogin: false,
      tryingToAppleLogin: false,
      email: {
        ...emptyInputComponent,
      },
      password: {
        ...emptyInputComponent,
      },
      fcmToken: '',
    };
    // messaging()
    //   .getToken()
    //   .then((token) => {
    //     this.setState({fcmToken: token});
    //   })
    //   .catch((error) => console.log(error));
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
            // console.log('The token is :');
            // console.log(token);
            this.setState({fcmToken: token});
          })
          .catch((error) => console.log(error));
      } else {
        Alert.alert('Enable notifications', 'Please enable notifications ');
      }
    });
  }

  async googleSignIn() {
    try {
      this.setState({tryingToGoogleLogin: true});
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // console.log(userInfo);
      const loginUrl = baseUrl + '/users/googleSignIn';
      const {fcmToken} = this.state;
      // console.log('The token is:');
      // console.log(fcmToken);
      // console.log(fcmToken);
      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          token: userInfo.idToken,
          fcmToken,
        }),
      });
      if (loginResponse.ok) {
        const loginResponseJSON = await loginResponse.json();
        this.setState({tryingToGoogleLogin: false});
        this.props.tryToLogin(
          loginResponseJSON.jwtAccessToken,
          loginResponseJSON.user,
        );
      } else if (loginResponse.status === 404) {
        this.setState({loginFailSnackbar: true, tryingToGoogleLogin: false});
        // await GoogleSignin.revokeAccess();
        // await GoogleSignin.signOut();
        setTimeout(() => {
          this.props.navigation.navigate('RegisterScreen', {
            isGoogleSignedIn: true,
          });
        }, 1000);
      } else {
        // console.log(loginResponse.status);
        Alert.alert(
          'Something went wrong: ' + loginResponse.status,
          'Something went wrong. Please try again in a while',
        );
        this.setState({tryingToGoogleLogin: false});
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
        Platform.OS === 'ios'
          ? Alert.alert(
              'Play services are not available.',
              'Your device does not have the google play services installed',
            )
          : Alert.alert(
              'Play services are not available.',
              'Please update your device to the newest android version',
            );
        console.log(error);
      } else {
        // some other error
        Alert.alert(
          'Something went wrong',
          'Something went wrong... ' + error.toString(),
        );
        // console.log('Unable to log you in. Please try again after some time.');
        console.log(error);
      }
      this.setState({tryingToGoogleLogin: false});
    }
  }

  async appleSignIn() {
    this.setState({tryingToAppleLogin: true});
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // get current authentication state for user
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        // console.log('Got the authorization from apple');
        // console.log(appleAuthRequestResponse);
        const appleLoginUrl = baseUrl + '/users/appleSignIn';
        const body = {
          idToken: appleAuthRequestResponse.identityToken,
          nonce: appleAuthRequestResponse.nonce,
          fcmToken: this.state.fcmToken,
        };
        const appleLoginResponse = await fetch(appleLoginUrl, {
          method: 'POST',
          headers: new Headers({
            'Content-type': 'application/json',
          }),
          body: JSON.stringify(body),
        });
        if (appleLoginResponse.ok) {
          const loginData = await appleLoginResponse.json();
          this.setState({tryingToAppleLogin: false});
          this.props.tryToLogin(loginData.jwtAccessToken, loginData.user);
        } else if (appleLoginResponse.status === 404) {
          this.setState({loginFailSnackbar: true, tryingToAppleLogin: false});
          setTimeout(() => {
            this.props.navigation.navigate('RegisterScreen', {
              isAppleSignedIn: true,
              appleAuthResponse: appleAuthRequestResponse,
            });
          }, 1000);
        } else {
          // console.log(loginResponse.status);
          Alert.alert(
            'Something went wrong: ' + appleLoginResponse.status,
            'Something went wrong. Please try again in a while',
          );
          this.setState({tryingToAppleLogin: false});
        }
      } else {
        console.log('The credential state is: ' + credentialState);
        this.setState({tryingToAppleLogin: false});
      }
    } catch (exception) {
      console.log(exception);
      this.setState({tryingToAppleLogin: false});
    }
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

  async login() {
    this.setState({tryingToLogin: true});
    const {email, password, fcmToken} = this.state;
    // console.log('The token is:');
    // console.log(fcmToken);

    if (email.isProper && password.isProper) {
      try {
        const url = baseUrl + '/users/login';
        const obj = {
          email: email.data,
          password: password.data,
          fcmToken,
        };
        const options = {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(obj),
        };
        const loginStatus = await fetch(url, options);
        if (loginStatus.ok) {
          const loginStatusJson = await loginStatus.json();
          const {user, jwtAccessToken} = loginStatusJson;
          this.setState({tryingToLogin: false});
          this.props.tryToLogin(jwtAccessToken, user);
        } else {
          // console.log('Error in login');
          this.setState({tryingToLogin: false});
          if (loginStatus.status === 401) {
            throw 'WRONG PASSWORD';
          } else if (loginStatus.status === 409) {
            throw 'SIGNED_WITH_PROVIDER';
          }
          Alert.alert(
            'Error in logging in: ' + loginStatus.status,
            'Error while logging in. Please try again after some time.',
          );
        }
      } catch (e) {
        this.setState({tryingToLogin: false});
        if (e === 'WRONG PASSWORD') {
          Alert.alert('Wrong Password');
        } else if (e === 'SIGNED_WITH_PROOVIDER') {
          Alert.alert(
            'OAuth user',
            'You have signed in using an OAuth provider. Please login with google or apple accordingly.',
          );
        } else {
          Alert.alert(
            'Error in logging in',
            'Error while logging in. Please try again after some time.',
          );
        }
        console.log(e);
      }
    } else {
      this.setState((prevState) => ({
        email: {
          data: prevState.email.data,
          isProper: this.checkEmailVerification(),
        },
        password: {
          data: prevState.password.data,
          isProper: this.checkPasswordVerification(),
        },
        tryingToLogin: false,
      }));
    }
  }

  render() {
    const {email, password} = this.state;
    const {loggedInStatus} = this.props.auth;
    if (loggedInStatus) {
      this.props.navigation.pop();
    }
    let iconSize = 20;
    return (
      <View
        style={{
          backgroundColor: primaryColor,
          flex: 1,
        }}>
        <ScrollView
          contentContainerStyle={{
            // flex: 1,
            // height: '100%',
            backgroundColor: 'white',
            minHeight: '100%',
            paddingHorizontal: '5%',
            alignItems: 'center',
            alignContent: 'center',
            borderRadius: normalRoundness,
            // justifyContent: 'center',
          }}>
          <View
            style={{
              marginTop: Dimensions.get('window').height * 0.05,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.props.navigation.canGoBack()) {
                    this.props.navigation.goBack();
                  } else {
                    this.props.navigation.navigate('Home');
                  }
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
                Log in
              </Text>
            </View>
            <View style={{flex: 1}} />
          </View>

          <View
            style={{
              marginTop: Dimensions.get('window').height * 0.03,
            }}>
            <View style={{marginBottom: 0}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.navigate('RegisterScreen', {
                    isGoogleSignedIn: false,
                  });
                }}
                style={{flex: 1}}>
                <View>
                  <Text
                    style={[globalStyles.normalText, {textAlign: 'center'}]}>
                    Not registered?{' '}
                    <Text
                      style={[
                        globalStyles.normalText,
                        {
                          color: primaryColor,
                          textAlign: 'center',
                        },
                      ]}>
                      {' '}
                      Create account
                    </Text>
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View
            style={{
              // flex: 3,
              width: '80%',
              alignItems: 'center',
              alignContent: 'center',
              // justifyContent: 'center',
              marginTop: Dimensions.get('window').height * 0.07,
            }}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  globalStyles.normalText,
                  email.isProper === undefined || email.isProper
                    ? styles.normalInput
                    : styles.wrongInput,
                ]}
                onChangeText={(text) =>
                  this.setState((prevState) => ({
                    email: {
                      data: text.toLowerCase(),
                      isProper: prevState.email.isProper,
                    },
                  }))
                }
                onEndEditing={(text) => {
                  this.setState({
                    email: {
                      data: text.nativeEvent.text.toLowerCase(),
                      isProper: this.checkEmailVerification(),
                    },
                  });
                }}
                value={this.state.email.data}
                placeholder={'Email'}
                placeholderTextColor={lightGreyTextColor}
                keyboardType={'email-address'}
              />
              {!(email.isProper === undefined || email.isProper) && (
                <Text style={[globalStyles.lightText, styles.errorText]}>
                  Invalid email
                </Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                // {'password'}
                secureTextEntry
                style={[
                  globalStyles.normalText,
                  password.isProper === undefined || password.isProper
                    ? styles.normalInput
                    : styles.wrongInput,
                ]}
                onChangeText={(text) =>
                  this.setState((prevState) => ({
                    password: {
                      data: text,
                      isProper: prevState.password.isProper,
                    },
                  }))
                }
                value={this.state.password.data}
                placeholder={'Password'}
                placeholderTextColor={lightGreyTextColor}

                // onEndEditing={(event) => {
                //   console.log('inside login password onBlur: ');
                //   console.log(event);
                //   event.persist();
                //   this.setState((prevState) => ({
                //     password: {
                //       data: prevState.password.data,
                //       isProper: this.checkPasswordVerification(),
                //     },
                //   }));
                // }}
              />
              {!(password.isProper === undefined || password.isProper) && (
                <Text style={[globalStyles.lightText, styles.errorText]}>
                  Invalid Password
                </Text>
              )}
              {/* Forgot Password */}
              <TouchableWithoutFeedback
                onPress={() => {
                  this.forgotPasswordSheetRef.open();
                }}>
                <Text
                  style={[
                    globalStyles.normalText,
                    {
                      color: primaryColor,
                      textAlign: 'center',
                    },
                  ]}>
                  Forgot Password?
                </Text>
              </TouchableWithoutFeedback>
            </View>
            {/* Google Sign in */}
            <View
              style={{
                backgroundColor: primaryColor,
                borderRadius: normalRoundness,
                width: '70%',
                marginTop: Dimensions.get('window').height * 0.07,
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
                  {!this.state.tryingToGoogleLogin ? (
                    <Text
                      style={[
                        globalStyles.normalTitle,
                        {
                          color: '#fff',
                          textAlign: 'center',
                          flex: 1,
                        },
                      ]}>
                      Sign in with Google
                    </Text>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flex: 1,
                      }}>
                      <CustomActivityIndicator color={'white'} size={'small'} />
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
            {/* Apple Sign in */}
            {Platform.OS === 'ios' ? (
              <View
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: normalRoundness,
                  width: '70%',
                  // marginTop: Dimensions.get('window').height * 0.07,
                  marginTop: 12,
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
                    {!this.state.tryingToAppleLogin ? (
                      <Text
                        style={[
                          globalStyles.normalTitle,
                          {
                            color: '#fff',
                            textAlign: 'center',
                            flex: 1,
                          },
                        ]}>
                        Sign in with Apple
                      </Text>
                    ) : (
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
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : null}
            {/* <AppleButton
              buttonStyle={AppleButton.Style.WHITE_OUTLINE}
              buttonType={AppleButton.Type.SIGN_IN}
              style={{
                width: '70%', // You must specify a width
                height: 45, // You must specify a height
                marginTop: 6,
                // backgroundColor: primaryColor,
              }}
              textStyle={[globalStyles.normalText]}
              cornerRadius={normalRoundness}
              onPress={() => this.onAppleButtonPress()}
            /> */}
            {/* Login */}
            <View
              style={{
                backgroundColor: primaryColor,
                borderRadius: normalRoundness,
                width: '70%',
                paddingVertical: 12,
                marginTop: 12,
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.login();
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {!this.state.tryingToLogin ? (
                    <Text
                      style={[
                        globalStyles.normalTitle,
                        {
                          color: '#fff',
                          textAlign: 'center',
                          flex: 1,
                        },
                      ]}>
                      Continue
                    </Text>
                  ) : (
                    <CustomActivityIndicator size={'small'} color={'white'} />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                // backgroundColor: primaryColor,
                // borderRadius: normalRoundness,
                width: '90%',
                paddingVertical: 12,
                marginTop: Dimensions.get('window').height * 0.02,
                justifyContent: 'center',
              }}>
              <Text style={[globalStyles.normalText, {textAlign: 'justify'}]}>
                By logging into your account you agree to our{' '}
                <TouchableWithoutFeedback
                  onPress={async () => {
                    const canOpenUrl = await Linking.canOpenURL(
                      termsAndConditions,
                    );
                    if (canOpenUrl) {
                      await Linking.openURL(termsAndConditions);
                    } else {
                      Alert.alert(
                        'Kindly visit our website',
                        'To view our Terms & Conditions, you can visit our website @: shopn.uk',
                      );
                    }
                  }}>
                  <Text style={[globalStyles.normalText, styles.hyperlinks]}>
                    Terms & Conditions.
                  </Text>
                </TouchableWithoutFeedback>
              </Text>
              <Text style={[globalStyles.normalText, {textAlign: 'justify'}]}>
                Please make sure to read our{' '}
                <TouchableWithoutFeedback
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
                  <Text style={[globalStyles.normalText, styles.hyperlinks]}>
                    Cookies Policy{' '}
                  </Text>
                </TouchableWithoutFeedback>
                &{' '}
                <TouchableWithoutFeedback
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
                  <Text style={[globalStyles.normalText, styles.hyperlinks]}>
                    Privacy Policy.
                  </Text>
                </TouchableWithoutFeedback>
              </Text>
            </View>
          </View>
        </ScrollView>
        <RBSheet
          ref={(ref) => {
            this.forgotPasswordSheetRef = ref;
          }}
          closeOnDragDown={false}
          height={Dimensions.get('window').height * 0.5}
          customStyles={{
            container: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              backgroundColor: primaryColor,
            },
            draggableIcon: {
              backgroundColor: primaryColor,
            },
          }}>
          <ForgotPasswordSheet
            auth={this.props.auth}
            closeSheet={() => this.forgotPasswordSheetRef.close()}
          />
        </RBSheet>
        {/* @ts-ignore */}
        <Snackbar
          visible={this.state.loginFailSnackbar}
          duration={2000}
          onDismiss={() => this.setState({loginFailSnackbar: false})}>
          Please register first
        </Snackbar>
      </View>
    );
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    tryToLogin: (jwtToken, userData) => dispatch(login(jwtToken, userData)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
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
    height: 40,
    width: '100%',
    paddingHorizontal: 12,
    borderColor: lightGreyColor,
    borderRadius: normalRoundness,
    borderWidth: 1,
  },
  wrongInput: {
    height: 40,
    width: '100%',
    paddingHorizontal: 12,
    borderColor: primaryColor,
    borderRadius: normalRoundness,
    borderWidth: 1,
  },
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'justify',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'justify',
  },
  hyperlinks: {
    color: primaryColor,
  },
});
