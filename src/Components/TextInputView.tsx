import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';

interface TextInputViewProps {
    handleQuery : (data: string) => void;
    getResponse: () => void;
}

const TextInputView: React.FC<TextInputViewProps> = ({handleQuery, getResponse}) => {
    const [query, setQuery] = useState<string>('');

    handleQuery(query);
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.inputStyle}
        value={query}
        onChangeText={setQuery}
        placeholder="Ask me any question..."
        autoCorrect={false} // Disable auto-correction
        spellCheck={false} // Disable spell-check
      />
      <TouchableOpacity onPress={getResponse} style={styles.buttonStyle}>
        <Text>
          <Icon name="arrow-up" color={'#FFFFFF'} size={20} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TextInputView;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  inputStyle: {
    backgroundColor: '#D2454544',
    color: '#000000',
    width: '88%',
    borderRadius: 30,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  buttonStyle: {
    backgroundColor: '#ef8585',
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 50,
  },
});
