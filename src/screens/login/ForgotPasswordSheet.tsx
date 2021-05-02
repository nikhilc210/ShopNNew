import * as React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  globalStyles,
  primaryColor,
  normalRoundness,
  lightGreyColor,
} from '../../style/globalStyles';
import {baseUrl} from '../../utils/config';
import {connect} from 'react-redux';

class ForgotPasswordSheet extends React.Component<
  any,
  {
    email: {
      isProper: undefined | boolean;
      data: string;
    };
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      email: {
        isProper: undefined,
        data: '',
      },
    };
  }

  checkEmailVerification() {
    const {email} = this.state;
    return (
      email.data !== undefined &&
      email.data.length > 5 &&
      /^\S+@\S+\.\S+$/.test(email.data)
    );
  }

  async requestForgotPassword() {
    const {email} = this.state;
    try {
      const url = baseUrl + '/users/initiateForgotPassword';
      const body = {
        email: email.data,
      };
      // console.log(url);
      // console.log(body);
      // Authorization: `Bearer ${this.props.auth.auth_token}`,
      const forgotPasswordResponse = await fetch(url, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
      });
      // console.log(forgotPasswordResponse);
      if (forgotPasswordResponse.ok) {
        Alert.alert(
          'Email sent',
          'An email has been sent to the mentioned email with the request.',
        );
      } else if (forgotPasswordResponse.status === 404) {
        Alert.alert(
          'User not found',
          'You probably have not registered at shopn previously using this email. Kindly register first.',
        );
      } else {
        Alert.alert(
          'Connection error: ' + forgotPasswordResponse.status,
          'An error occurred while responding to your request. Kindly try again after some time.',
        );
      }
    } catch (e) {
      console.log(e);
      Alert.alert(
        'Unexpected error',
        'An error occurred while responding to your request. Kindly try again after some time.',
      );
    }
  }
  render() {
    const {email} = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignContent: 'center',
          // height: 700,
          paddingTop: '5%',
          paddingHorizontal: 32,
        }}>
        <View>
          <Text
            style={[
              globalStyles.normalTitle,
              {
                textAlign: 'center',
                color: primaryColor,
              },
            ]}>
            Forgot your password?
          </Text>
        </View>
        <View>
          <Text
            style={[
              globalStyles.normalText,
              {
                textAlign: 'center',
                marginHorizontal: 12,
                marginTop: 12,
                fontSize: 11,
                lineHeight: 14,
                // color: primaryColor,
              },
            ]}>
            *To ensure that you can access your active account, kindly send us
            the email address with which you previously logged in. We'll send
            you an e-mail to change your password.
          </Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: '5%'}}>
          <Text
            style={[
              globalStyles.normalText,
              {
                marginEnd: 12,
                flex: 3,
                fontSize: 12,
              },
            ]}>
            Email
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            // @ts-ignore
            type={'text'}
            style={[
              globalStyles.normalText,
              email.isProper === undefined || email.isProper
                ? styles.normalInput
                : styles.wrongInput,
            ]}
            onChangeText={(text) =>
              this.setState((prevState) => ({
                email: {data: text, isProper: prevState.email.isProper},
              }))
            }
            value={this.state.email.data}
            placeholder={'Email'}
            keyboardType={'email-address'}
            onEndEditing={() => {
              this.setState((prevState) => ({
                email: {
                  data: prevState.email.data,
                  isProper: this.checkEmailVerification(),
                },
              }));
            }}
          />
          {!(email.isProper === undefined || email.isProper) && (
            <Text style={[globalStyles.lightText, styles.errorText]}>
              Invalid email
            </Text>
          )}
        </View>
        {this.state.email.isProper && (
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              alignSelf: 'center',
              // flex: 1,
              width: '80%',
              marginHorizontal: 12,
              borderRadius: normalRoundness,
              backgroundColor: primaryColor,
            }}>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={() => {
                this.props.closeSheet();
              }}>
              <View
                style={{
                  alignItems: 'center',
                  paddingVertical: 12,
                }}>
                <Text style={[globalStyles.normalText, {color: 'white'}]}>
                  Send
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
    );
  }
}

export default ForgotPasswordSheet;

const styles = StyleSheet.create({
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
});
