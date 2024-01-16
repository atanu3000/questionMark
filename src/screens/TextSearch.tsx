import {
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

const TextSearch = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const genAI = new GoogleGenerativeAI(API_KEY);

  async function getResponse() {
    setResponse('');
    const model = genAI.getGenerativeModel({model: 'gemini-pro'});
    const result = await model.generateContent(query);
    const response = result.response;
    setResponse(response.text());
  }

  const markdownStyle: {[key: string]: TextStyle} = {
    heading1: {
      color: 'blue',
    },
    heading2: {
      color: 'green',
    },
    heading3: {
      color: 'red',
    },
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
    link: {
      color: 'purple',
    },
    text: {
      color: '#000',
    },
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
      <ScrollView contentContainerStyle={styles.responseContainer}>
        {response && (
          <>
            <Markdown style={markdownStyle}>{response}</Markdown>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity style={styles.regenerate} onPress={getResponse}>
                <Text>
                  <Icon name="arrows-rotate" color={'#FFFFFF'} size={18} />
                  {'  '}
                  Regenerate Response
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
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
  responseContainer: {
    paddingHorizontal: 12,
    paddingBottom: 30,
  },
  regenerate: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ef8585',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 20,
  },
});
