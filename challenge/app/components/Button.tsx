import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'outline' && styles.outlineButton,
    variant === 'danger' && styles.dangerButton,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyleArray = [
    styles.text,
    variant === 'primary' && styles.text,
    variant === 'outline' && styles.outlineText,
    variant === 'danger' && styles.dangerText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#3498db' : '#fff'} />
      ) : (
        <Text style={textStyleArray}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    borderColor: '#bdc3c7',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: '#3498db',
  },
  dangerText: {
    color: '#fff',
  },
  disabledText: {
    color: '#7f8c8d',
  },
});

export default Button;
