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

class ContactSheet extends React.Component<
  {
    auth_token: string;
    closeSheet: any;
    navigation: any;
    user: UserDetails;
    updateUser: any;
  },
  {
    dataChanged: boolean;
    isLoading: boolean;
    mobileNumber: InputFieldComponent;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataChanged: false,
      mobileNumber: {
        data: this.props.user.mobile_no,
        isProper: true,
      },
    };
  }

  checkMobileNoVerification(number) {
    return number !== undefined && /^[0-9][0-9]{9,10}$/.test(number);
  }
  render() {
    const {mobileNumber} = this.state;
    const originalNumber = this.props.user.mobile_no;
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
              Contact number
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>
        <View
          style={{
            width: '100%',
            marginTop: '10%',
          }}>
          <View>
            <Text style={[globalStyles.lightText]}>
              Please keep your contact number updated so that we can contact you
              for any kind of dispute.
            </Text>
          </View>
          <View style={{width: '50%', alignSelf: 'flex-start', marginTop: 20}}>
            <Text style={[globalStyles.normalText]}>Mobile Number</Text>
            <CustomInputComponent
              type={'text'}
              onChangeText={(text) =>
                this.setState((prevState) => ({
                  dataChanged: originalNumber !== text,
                  mobileNumber: {
                    data: text,
                    isProper: this.checkMobileNoVerification(text),
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
                  dataChanged: originalNumber !== text.nativeEvent.text,
                  mobileNumber: {
                    data: text.nativeEvent.text,
                    isProper: this.checkMobileNoVerification(
                      text.nativeEvent.text,
                    ),
                  },
                });
              }}
            />
          </View>
        </View>
        {this.state.dataChanged ? (
          <TouchableWithoutFeedback
            disabled={this.state.isLoading}
            onPress={() => {
              this.saveMobileChange();
            }}>
            <View
              style={{
                backgroundColor: primaryColor,
                borderRadius: normalRoundness,
                paddingVertical: 10,
                width: '80%',
                position: 'absolute',
                // bottom: 20,
                alignSelf: 'center',
                bottom: Platform.OS === 'ios' ? 32 : 20,
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
                <CustomActivityIndicator size={'small'} color={'white'} />
              )}
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    );
  }

  checkAllAreOk() {
    const {mobileNumber} = this.state;
    console.log(mobileNumber.isProper);
    return mobileNumber.isProper;
  }

  async saveMobileChange() {
    try {
      if (this.checkAllAreOk()) {
        const url = baseUrl + '/users/userDetails/' + this.props.user.id;
        const {mobileNumber} = this.state;
        const body = {
          mobile_no: mobileNumber.data,
        };
        // console.log('Trying to do a patch request to fix the mobile number');
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
          this.props.updateUser(data);
        } else {
          Alert.alert(
            'Error while processing your request. Please try again after some time.',
          );
          this.props.closeSheet();
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert(
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactSheet);
