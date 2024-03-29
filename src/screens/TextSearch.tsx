import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

// API specific imports
import {GoogleGenerativeAI} from '@google/generative-ai';
import {API_KEY} from '../../API'; // set up your API key at root directory
import ResponseView from '../Components/ResponseView';
import TextInputView from '../Components/TextInputView';
import Snackbar from 'react-native-snackbar';
import {saveData} from '../Components/NavigationView';

const TextSearch = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const genAI = new GoogleGenerativeAI(API_KEY);

  useEffect(() => {
    const checkConnection = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      checkConnection();
    };
  }, []);

  const getResponse = async () => {
    if (!isConnected) {
      return Snackbar.show({
        text: 'Please turn on either wifi or data connection and try again.',
        duration: 5000,
        backgroundColor: '#D24545',
      });
    }

    setResponse('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      const result = await model.generateContent(query);
      const response = result.response;

      setResponse(response.text());
      saveData(query, response.text());
    } catch (error) {
      console.error('An error occurred:', error);
      setResponse(` ### **This content may violate our content policy.** `);
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
        getResponse={query.trim().length === 0 ? () => null : getResponse}
      />
    </View>
  );
};

export default TextSearch;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    height: Dimensions.get('window').height - 94,
    paddingBottom: 10,
  },
});
