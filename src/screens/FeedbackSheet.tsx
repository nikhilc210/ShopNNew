import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
} from 'react-native';
import {
  globalStyles,
  lightGreyTextColor,
  normalRoundness,
  primaryColor,
} from '../style/globalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Stars from 'react-native-stars';
import CustomActivityIndicator from '../components/common/CustomActivityIndicator';
import {baseUrl} from '../utils/config';
import {connect} from 'react-redux';
import {UserDetails} from '../store/actionsAndReducers/auth/userDetails';
import {Order} from '../components/ordersScreen/types/Order';

// interface Order {
//   productDetailsAreLoaded: boolean;
//   address: string;
//   orderId: string;
//   shopId: string;
//   shopName: string;
//   shopImageUrl: any;
//   estimatedDeliveryTime: string;
//   deliveryCharge: string;
//   totalPrice: string;
//   selectedOption: string;
//   status: string;
//   products: {
//     productImgUrl: any;
//     quantity: number;
//     productId: string;
//     price: string;
//     productName: string;
//   }[];
// }

class FeedbackSheet extends React.Component<
  {
    navigation: any;
    closeSheet: any;
    order: Order;
    user: UserDetails;
    authToken: string;
  },
  {
    stars: number;
    reviewText: string;
    suggestionsText: string;
    isSubmitting: boolean;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      suggestionsText: '',
      reviewText: '',
      stars: 0,
    };
  }
  render() {
    const starSize = 32;
    const iconSize = 20;
    return (
      <View
        style={{
          backgroundColor: primaryColor,
          flex: 1,
        }}>
        <ScrollView
          contentContainerStyle={{
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
              marginTop: Dimensions.get('window').height * 0.04,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.closeSheet();
                }}>
                <View>
                  <MaterialIcons
                    name={'close'}
                    color={primaryColor}
                    size={iconSize}
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
                Feedback
              </Text>
            </View>
            <View style={{flex: 1}} />
          </View>

          <View
            style={{
              marginTop: Dimensions.get('window').height * 0.04,
            }}>
            <View style={{marginBottom: 0}}>
              <View>
                <Stars
                  half={true}
                  default={this.state.stars}
                  update={(val) => {
                    this.setState({stars: val});
                  }}
                  spacing={8}
                  starSize={starSize}
                  count={5}
                  fullStar={require('../assets/stars/starFilled.png')}
                  emptyStar={require('../assets/stars/starEmpty.png')}
                  halfStar={require('../assets/stars/starHalf.png')}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: Dimensions.get('window').height * 0.04,
              justifyContent: 'flex-start',
              width: '100%',
            }}>
            <Text style={[globalStyles.normalTitle]}>Reviews</Text>
            <TextInput
              value={this.state.reviewText}
              style={[
                globalStyles.lightTitle,
                {
                  paddingVertical: 2,
                  paddingHorizontal: 12,
                  marginVertical: 6,
                  borderWidth: 0.5,
                  borderRadius: normalRoundness,
                  lineHeight: 16,
                  textAlignVertical: 'top',
                },
              ]}
              multiline
              numberOfLines={10}
              placeholder={'Please send us your reviews'}
              placeholderTextColor={lightGreyTextColor}
              onChangeText={(newDesc: string) =>
                this.setState({reviewText: newDesc})
              }
            />
          </View>
          {/*<View*/}
          {/*  style={{*/}
          {/*    marginTop: Dimensions.get('window').height * 0.04,*/}
          {/*    justifyContent: 'flex-start',*/}
          {/*    width: '100%',*/}
          {/*  }}>*/}
          {/*  <Text style={[globalStyles.normalTitle]}>Suggestions</Text>*/}
          {/*  <TextInput*/}
          {/*    style={[*/}
          {/*      globalStyles.lightTitle,*/}
          {/*      {*/}
          {/*        paddingVertical: 2,*/}
          {/*        paddingHorizontal: 12,*/}
          {/*        marginVertical: 6,*/}
          {/*        borderWidth: 0.5,*/}
          {/*        borderRadius: normalRoundness,*/}
          {/*        lineHeight: 16,*/}
          {/*        textAlignVertical: 'top',*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*    multiline*/}
          {/*    numberOfLines={10}*/}
          {/*    onChangeText={(newDesc: string) => this.changeReviews(newDesc)}*/}
          {/*    // @ts-ignore*/}
          {/*    value={''}*/}
          {/*  />*/}
          {/*</View>*/}
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              backgroundColor: primaryColor,
              borderRadius: normalRoundness,
              width: '80%',
              paddingVertical: 10,
              marginTop: Dimensions.get('window').height * 0.01,
            }}>
            {!this.state.isSubmitting ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  this.submitReviews();
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
                    Submit
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <CustomActivityIndicator size={'small'} color={'white'} />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  private async submitReviews() {
    try {
      this.setState({isSubmitting: true});
      const url = baseUrl + '/reviews/ratings';
      const {
        stars,
        reviewText,
        // suggestionsText
      } = this.state;
      const body = {
        id: this.props.order.orderId,
        shop_id: this.props.order.shopId,
        customer_id: this.props.user.id,
        stars,
        text: reviewText,
        // suggestions: suggestionsText,
      };
      // console.log(url);
      // console.log(body);
      const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${this.props.authToken}`,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        Alert.alert('Error in sending your feedback. Please try again later');
      }
      this.setState({isSubmitting: false});
      this.props.closeSheet();
    } catch (e) {
      console.log(e);
      this.setState({isSubmitting: false});
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    authToken: state.auth.auth_token,
  };
}

export default connect(mapStateToProps)(FeedbackSheet);

// const styles = StyleSheet.create({
//   buttonTextStyle: {
//     color: '#fff',
//     textAlignVertical: 'top',
//     fontSize: 16,
//   },
//   buttonContainer: {
//     padding: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: primaryColor,
//   },
//   normalInput: {
//     height: 40,
//     width: '100%',
//     paddingHorizontal: 12,
//     borderColor: lightGreyColor,
//     borderRadius: normalRoundness,
//     borderWidth: 1,
//   },
//   wrongInput: {
//     height: 40,
//     width: '100%',
//     paddingHorizontal: 12,
//     borderColor: primaryColor,
//     borderRadius: normalRoundness,
//     borderWidth: 1,
//   },
//   inputContainer: {
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignContent: 'center',
//     textAlign: 'justify',
//     marginBottom: 20,
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'justify',
//   },
//   hyperlinks: {
//     color: primaryColor,
//   },
// });
