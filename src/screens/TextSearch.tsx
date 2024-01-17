import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Markdown from 'react-native-markdown-display';

// API specific imports
import {GoogleGenerativeAI} from '@google/generative-ai';
import {API_KEY} from '../../API'; // set up your API key at root directory
import {markdownStyle} from '../maekdownStyle';
import ResponseView from '../Components/ResponseView';

const TextSearch = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const genAI = new GoogleGenerativeAI(API_KEY);

  const getResponse = async () => {
    setResponse('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      const result = await model.generateContent(query);
      const response = result.response;

      setResponse(response.text());
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
      <ResponseView
        isLoading={isLoading}
        response={response}
        getResponse={getResponse}
      />
    </View>
  );
};

export default TextSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height - 94,
    paddingBottom: 10,
  },
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
