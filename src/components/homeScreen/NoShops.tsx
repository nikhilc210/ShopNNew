import * as React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
} from 'react-native';
import {
  globalStyles,
  lightGreyColor,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import {InputFieldComponent} from '../../utils/formControls';
import {CustomInputComponent} from '../../screens/login/CustomInputComponent';
import {baseUrl} from '../../utils/config';
import CustomActivityIndicator from '../common/CustomActivityIndicator';

const emptyInputComponent: InputFieldComponent = {
  data: '',
  isProper: undefined,
};

export default class NoShops extends Component<
  any,
  {
    email: InputFieldComponent;
    pinCode: InputFieldComponent;
    isSubmitting: boolean;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      email: emptyInputComponent,
      pinCode: emptyInputComponent,
      isSubmitting: false,
    };
  }
  checkAddressLineVerification(text: string) {
    return text !== undefined && /^[a-zA-Z0-9]{5,8}$/.test(text);
  }
  checkEmailVerification() {
    const {email} = this.state;
    return (
      email.data !== undefined &&
      email.data.length > 5 &&
      /^\S+@\S+\.\S+$/.test(email.data)
    );
  }
  render() {
    const {email, pinCode} = this.state;
    return (
      <View
        style={{
          marginHorizontal: '5%',
          padding: 12,
          borderWidth: 1,
          borderColor: lightGreyColor,
          borderRadius: normalRoundness,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={[
            globalStyles.normalTitle,
            {
              color: primaryColor,
            },
          ]}>
          Can't find a shop nearby?
        </Text>
        <View
          style={{
            width: '90%',
            marginTop: 32,
          }}>
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
              this.setState({
                pinCode: {
                  data: text.nativeEvent.text.toUpperCase(),
                  isProper: this.checkAddressLineVerification(
                    text.nativeEvent.text,
                  ),
                },
              });
            }}
          />
        </View>
        <View style={{width: '80%'}}>
          <Text style={[globalStyles.lightText, {textAlign: 'justify'}]}>
            This data will be used to improve our services. You will be updated
            once there is a store nearby.
          </Text>
        </View>
        <View
          style={{
            backgroundColor: primaryColor,
            borderRadius: normalRoundness,
            width: '80%',
            paddingVertical: 10,
            marginTop: Dimensions.get('window').height * 0.01,
          }}>
          {!this.state.isSubmitting ? (
            <TouchableWithoutFeedback
              onPress={() => {
                this.sendLocationUpdate();
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    globalStyles.normalTitle,
                    {
                      color: '#fff',
                      textAlign: 'center',
                      flex: 1,
                    },
                  ]}>
                  Update me
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <CustomActivityIndicator size={'small'} color={'white'} />
          )}
        </View>
      </View>
    );
  }

  async sendLocationUpdate() {
    try {
      this.setState({isSubmitting: true});
      const url = baseUrl + '/noShopLocation/request';
      const {email, pinCode} = this.state;
      if (email.isProper && pinCode.isProper) {
        const body = {
          email: email.data,
          pincode: pinCode.data,
        };
        // console.log(url);
        // console.log(body);
        const response = await fetch(url, {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(body),
        });
        if (response.ok) {
          Alert.alert('Thank you');
          this.setState({isSubmitting: false});
        } else {
          this.setState({isSubmitting: false});
        }
      } else {
        // console.log('incorrect pair of email and pincode');
        // console.log(email.data);
        // console.log(pinCode.data);
        this.setState((prevState) => ({
          email: {
            data: prevState.email.data,
            isProper: this.checkEmailVerification(),
          },
          pinCode: {
            data: prevState.pinCode.data.toUpperCase(),
            isProper: this.checkAddressLineVerification(prevState.pinCode.data),
          },
          isSubmitting: false,
        }));
      }
    } catch (e) {
      console.log(e);
      this.setState({isSubmitting: false});
    }
  }
}
