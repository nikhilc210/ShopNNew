import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
export const primaryColor = '#45B7E8';
export const primaryDarkColor = '#007BB0';
export const backgroundDarkPrimary = '#004663';
export const backgroundDarkSecondary = '#1E4F63';
export const secondaryColor = '#45B7E8';
export const lightGreyColor = '#EAEAEA';
export const lightGreyTextColor: string = '#757575';
export const normalRoundness = 6;
export const buttonRadius = 40;

export const globalStyles = StyleSheet.create({
  normalTitle: {
    fontFamily: 'SourceSansPro-Regular',
    fontStyle: 'normal',
    fontSize: RFValue(14),
    lineHeight: RFValue(18),
  },
  normalText: {
    fontFamily: 'SourceSansPro-Regular',
    fontStyle: 'normal',
    fontSize: RFValue(11),
    lineHeight: RFValue(16),
  },
  lightTitle: {
    fontFamily: 'SourceSansPro-Light',
    fontStyle: 'normal',
    fontSize: RFValue(10),
    lineHeight: RFValue(16),
    color: '#323232',
  },
  lightText: {
    fontFamily: 'SourceSansPro-Light',
    fontStyle: 'normal',
    fontSize: RFValue(10),
    lineHeight: RFValue(14),
    color: '#323232',
  },
  boldTitle: {
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '300',
    fontSize: RFValue(14),
    lineHeight: RFValue(24),
  },
  boldText: {
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: 'bold',
    fontSize: RFValue(12),
    lineHeight: RFValue(21),
  },
  greyBackgroundTextColor: {
    color: '#757575',
  },
});
