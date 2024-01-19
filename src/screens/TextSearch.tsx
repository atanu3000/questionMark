import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';

// API specific imports
import {GoogleGenerativeAI} from '@google/generative-ai';
import {API_KEY} from '../../API'; // set up your API key at root directory
import ResponseView from '../Components/ResponseView';
import TextInputView from '../Components/TextInputView';

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
      <TextInputView handleInput={setQuery} getResponse={getResponse} />
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
    justifyContent: 'center',
    height: Dimensions.get('window').height - 94,
    paddingBottom: 10,
  },
});
