import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Snackbar from 'react-native-snackbar';

interface TextInputViewProps {
    handleInput : (data: string) => void;
    getResponse: () => void;
}

const TextInputView: React.FC<TextInputViewProps> = ({handleInput, getResponse}) => {
    const [input, setInput] = useState<string>('');

    const clearInput = () => {
      setInput('');
      handleInput('');
    }

    const inputHandler = (input: string) => {
      setInput(input);
      handleInput(input);
    }
    
    const responseHandler = () => {
      if (input.trim().length === 0) {
        return Snackbar.show({
          text: 'Please ask me any question before continuing!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "#D24545",
        })
      }
      getResponse();
    }
  return (
    <View style={styles.searchContainer}>
        <View style={styles.inputStyle}>
          <TextInput
            style={{width: '88%'}}
            value={input}
            onChangeText={(value) => inputHandler(value)}
            placeholder="Ask me any question..."
            autoCorrect={false} // Disable auto-correction
            spellCheck={false} // Disable spell-check
          />
          {input.trim().length > 0 && (
            <TouchableOpacity
              onPress={clearInput}
              style={styles.clearInput}>
              <Icon name="xmark" color={'#000'} size={24} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={responseHandler} style={styles.buttonStyle} >
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D2454544',
    color: '#000000',
    width: '88%',
    borderRadius: 30,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  clearInput: {
    gap: 8,
    paddingRight: 7,
  },
  buttonStyle: {
    backgroundColor: '#ef8585',
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 50,
  },
});