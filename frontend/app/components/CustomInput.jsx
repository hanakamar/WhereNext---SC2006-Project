import React from 'react';
import { TextInput } from 'react-native';
import { commonStyles } from '../styles/commonStyleSheet';

const CustomInput = ({ placeholder, value, setValue, secureTextEntry, keyboardType }) => {
  return (
    <TextInput
      style={commonStyles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={setValue}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  );
};

export default CustomInput;