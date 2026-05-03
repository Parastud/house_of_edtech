import React, { useState } from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import { Icon, IoniconsName } from '../../theme/icons';
import { GlobalStyles } from '../../theme/styles.global';
import { AppText } from './AppText';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: IoniconsName;
  rightIcon?: IoniconsName;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;
  const secureEntry = isPassword && !showPassword;

  return (
    <View className="mb-4">
      {label && (
        <AppText variant="labelSm" style={styles.label}>
          {label}
        </AppText>
      )}

      <View
        style={[
          GlobalStyles.inputBase,
          isFocused && !hasError && GlobalStyles.inputFocused,
          hasError && GlobalStyles.inputError,
        ]}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={18}
            color={
              hasError
                ? Colors.error
                : isFocused
                ? Colors.primary
                : Colors.textMuted
            }
          />
        )}

        <TextInput
          style={[GlobalStyles.inputText, style]}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((p) => !p)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name={rightIcon} size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontFamily: FONTS.MEDIUM,
    color: Colors.textSecondary,
  },
  errorText: {
    marginTop: 4,
    color: Colors.error,
    fontFamily: FONTS.REGULAR,
  },
});