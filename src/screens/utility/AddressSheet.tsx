import * as React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {
  globalStyles,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';
import {InputFieldComponent} from '../../utils/formControls';
import {CustomInputComponent} from '../login/CustomInputComponent';
import {UserDetails} from '../../store/actionsAndReducers/auth/userDetails';
import CustomActivityIndicator from '../../components/common/CustomActivityIndicator';
import {baseUrl} from '../../utils/config';
import {updateUserData} from '../../store/actionsAndReducers/auth/actions';

class AddressSheet extends React.Component<
  {
    auth_token: string;
    closeSheet: any;
    navigation: any;
    user: UserDetails;
    updateUser: any;
  },
  {
    isLoading: boolean;
    addressLine1: InputFieldComponent;
    addressLine2: InputFieldComponent;
    county: InputFieldComponent;
    pinCode: InputFieldComponent;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      addressLine1: {
        data: this.props.user.address[0].line_1,
        isProper: undefined,
      },
      addressLine2: {
        data: this.props.user.address[0].line_2,
        isProper: undefined,
      },
      county: {
        data: this.props.user.address[0].county,
        isProper: undefined,
      },
      pinCode: {
        data: this.props.user.address[0].pinCode,
        isProper: undefined,
      },
    };
  }

  checkAddressLineVerification(text: string) {
    return (
      text !== undefined && text.length > 1 && /[ a-zA-Z0-9,-]+$/.test(text)
    );
  }

  checkPinCodeVerification(text) {
    return text !== undefined && /^[ A-Z0-9]{5,8}$/.test(text);
  }

  render() {
    const {addressLine1, addressLine2, county, pinCode} = this.state;
    const address = this.props.user.address[0];
    const original_address_line_1 = address.line_1;
    const original_address_line_2 = address.line_2;
    const original_pinCode = address.pinCode;
    const original_county = address.county;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingVertical: '5%',
          paddingHorizontal: '5%',
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.closeSheet();
              }}>
              <View>
                <MaterialIcons name={'close'} color={primaryColor} size={20} />
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
              Change Address
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>
        <View
          style={{
            width: '100%',
            marginTop: '10%',
          }}>
          <CustomInputComponent
            type={'text'}
            onChangeText={(text) =>
              this.setState(() => ({
                addressLine1: {
                  data: text,
                  isProper: this.checkAddressLineVerification(text),
                },
              }))
            }
            value={addressLine1.data}
            isProper={addressLine1.isProper}
            placeholder={'Address Line 1'}
            errorLabel={'Invalid Address Line'}
            onEndEditing={(text) => {
              // console.log(text.nativeEvent);
              text.persist();
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
              this.setState(() => ({
                addressLine2: {
                  data: text,
                  isProper: this.checkAddressLineVerification(text),
                },
              }))
            }
            value={addressLine2.data}
            isProper={addressLine2.isProper}
            placeholder={'Address Line 2'}
            errorLabel={'Invalid Address Line'}
            onEndEditing={(text) => {
              // console.log(text.nativeEvent);
              text.persist();
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
                  this.setState(() => ({
                    county: {
                      data: text,
                      isProper: true,
                    },
                  }))
                }
                value={county.data}
                isProper={county.isProper}
                placeholder={'County (Optional)'}
                errorLabel={'Invalid County'}
                onEndEditing={(text) => {
                  // console.log(text.nativeEvent);
                  text.persist();
                  this.setState(() => ({
                    county: {
                      data:
                        text.nativeEvent.text !== null
                          ? text.nativeEvent.text
                          : '',
                      isProper: true,
                    },
                  }));
                }}
              />
            </View>
            <View style={{flex: 1, marginStart: 2}}>
              <CustomInputComponent
                type={'text'}
                onChangeText={(text: string) =>
                  this.setState(() => ({
                    pinCode: {
                      data: text.toUpperCase(),
                      isProper: this.checkPinCodeVerification(
                        text.toUpperCase(),
                      ),
                    },
                  }))
                }
                value={pinCode.data}
                isProper={pinCode.isProper}
                placeholder={'Postcode'}
                errorLabel={'Invalid Postcode'}
                onEndEditing={(text) => {
                  // console.log(text.nativeEvent);
                  text.persist();
                  console.log('**********On End Editing*************');
                  console.log(text);
                  if (text === null) {
                    return;
                  }
                  this.setState((prevState) => ({
                    pinCode: {
                      data:
                        text.nativeEvent.text !== null
                          ? text.nativeEvent.text.toUpperCase()
                          : prevState.pinCode.data,
                      isProper: this.checkPinCodeVerification(
                        text.nativeEvent.text !== null
                          ? text.nativeEvent.text.toUpperCase()
                          : prevState.pinCode.data,
                      ),
                    },
                  }));
                }}
              />
            </View>
          </View>
        </View>
        <View />
        {this.state.addressLine1.data !== original_address_line_1 ||
        this.state.addressLine2.data !== original_address_line_2 ||
        this.state.pinCode.data !== original_pinCode ||
        this.state.county.data !== original_county ? (
          <TouchableWithoutFeedback
            onPress={() => {
              this.saveAddressChange();
            }}>
            <View
              style={{
                backgroundColor: primaryColor,
                borderRadius: normalRoundness,
                paddingVertical: 10,
                width: '80%',
                position: 'absolute',
                bottom: Platform.OS === 'ios' ? 32 : 20,
                alignSelf: 'center',
                // marginTop: Dimensions.get('window').height * 0.01,
              }}>
              {!this.state.isLoading ? (
                <Text
                  style={[
                    globalStyles.normalTitle,
                    {
                      color: 'white',
                      textAlign: 'center',
                    },
                  ]}>
                  Save Changes
                </Text>
              ) : (
                <CustomActivityIndicator
                  style={{alignSelf: 'center'}}
                  size={'small'}
                  color={'white'}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    );
  }

  checkAllAreOk() {
    const {addressLine1, addressLine2, pinCode} = this.state;
    if (
      addressLine1.isProper === undefined &&
      !this.checkAddressLineVerification(addressLine1.data)
    ) {
      this.setState((prevState) => ({
        addressLine1: {
          data: prevState.addressLine1.data,
          isProper: false,
        },
      }));
      return false;
    }
    if (
      addressLine2.isProper === undefined &&
      !this.checkAddressLineVerification(addressLine2.data)
    ) {
      this.setState((prevState) => ({
        addressLine2: {
          data: prevState.addressLine2.data,
          isProper: false,
        },
      }));
      return false;
    }
    if (
      pinCode.isProper === undefined &&
      !this.checkPinCodeVerification(pinCode.data)
    ) {
      this.setState((prevState) => ({
        pinCode: {
          data: prevState.pinCode.data,
          isProper: false,
        },
      }));
      return false;
    }
    return true;
  }

  async saveAddressChange() {
    try {
      if (this.checkAllAreOk()) {
        this.setState({isLoading: true});
        const url = baseUrl + '/users/userDetails/' + this.props.user.id;
        const {addressLine1, addressLine2, pinCode, county} = this.state;
        const body = {
          address: [
            {
              line_1: addressLine1.data,
              line_2: addressLine2.data,
              pinCode: pinCode.data,
              county: county.data,
            },
          ],
        };
        // console.log('Trying to do a patch request to fix the address');
        // console.log(url);
        // console.log(body);
        const response = await fetch(url, {
          method: 'PATCH',
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.auth_token}`,
          }),
          body: JSON.stringify(body),
        });
        // console.log(response);
        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          this.setState({isLoading: false});
          this.props.updateUser(data);
          this.props.closeSheet();
        } else {
          this.setState({isLoading: false});
          Alert.alert(
            'Error ' + response.status,
            'Error while processing your request. Please try again after some time.',
          );
          this.props.closeSheet();
        }
      }
    } catch (e) {
      console.log(e);
      this.setState({isLoading: false});
      Alert.alert(
        'Error 418' +
          'Error while processing your request. Please try again after some time.',
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    auth_token: state.auth.auth_token,
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateUser: (user) => dispatch(updateUserData(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressSheet);
