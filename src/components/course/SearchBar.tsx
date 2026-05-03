import { DEBOUNCE_SEARCH_MS } from '@/src/constants/app.constants';
import React, { useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Colors } from '../../theme/colors';
import { FONTS, FontSize } from '../../theme/fonts';
import { Icon } from '../../theme/icons';
import { debounce } from '../../utils/utils';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search courses...',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const debouncedChange = useRef(
    debounce((text: unknown) => onChangeText(text as string), DEBOUNCE_SEARCH_MS),
  ).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.borderFocus],
  });

  return (
    <Animated.View style={[styles.container, { borderColor }]}>
      <Icon
        name="search-outline"
        size={18}
        color={isFocused ? Colors.primary : Colors.textMuted}
      />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        defaultValue={value}
        onChangeText={debouncedChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            inputRef.current?.clear();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="close-outline" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.REGULAR,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    padding: 0,
  },
});