// const customInputComponent = <P extends object>(
//   Component: React.ComponentType<P>,
// ) =>
import * as React from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {
  globalStyles,
  lightGreyColor,
  lightGreyTextColor,
  normalRoundness,
  primaryColor,
} from '../../style/globalStyles';

interface InputProps {
  isProper: boolean;
  onChangeText: (text) => void;
  value: string;
  onEndEditing: (text) => void;
  errorLabel: string;
  type: string;
  placeholder: string;
}

export function CustomInputComponent(props: any & InputProps) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        {...props}
        type={props.type}
        style={[
          globalStyles.normalText,
          props.isProper === undefined || props.isProper
            ? styles.normalInput
            : styles.wrongInput,
        ]}
        onChangeText={props.onChangeText}
        value={props.value}
        placeholder={props.placeholder}
        placeholderTextColor={lightGreyTextColor}
        // keyboardType={'email-address'}
        onEndEditing={props.onEndEditing}
      />
      {!(props.isProper === undefined || props.isProper) && (
        <Text style={[globalStyles.lightText, styles.errorText]}>
          {props.errorLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  normalInput: {
    // flex: 1,
    height: 40,
    width: '100%',
    paddingHorizontal: 12,
    borderColor: lightGreyColor,
    borderRadius: normalRoundness,
    borderWidth: 1,
    // color: lightGreyTextColor,
  },
  wrongInput: {
    // flex: 1,
    height: 40,
    width: '100%',
    paddingHorizontal: 12,
    borderColor: primaryColor,
    borderRadius: normalRoundness,
    borderWidth: 1,
    // color: lightGreyTextColor,
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
