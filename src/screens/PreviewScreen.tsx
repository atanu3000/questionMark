import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Share,
  ToastAndroid,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {markdownStyle} from '../markdownStyle';
import {QueryResponse} from '../Components/NavigationView';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Clipboard from '@react-native-clipboard/clipboard';

interface PreviewScreenProps {
  onClose: () => void;
  content: QueryResponse | undefined;
}

const handleCopy = (query: string, response: string) => {
  Clipboard.setString(query + '\n\n' + response.replace(/\*\*/g, '*'));
  ToastAndroid.show('Copied successfully', ToastAndroid.SHORT)
}

const handleShare = (query: string, response: string) => {
  Share.share({
    message: query + '\n\n' + response.replace(/\*\*/g, '*'),
    
  })
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({onClose, content}) => {
  return (
    <View style={{paddingHorizontal: 0, flex: 1}}>
      <ScrollView contentContainerStyle={{padding: 10, paddingBottom: 80}}>
        <Markdown style={markdownStyle}>{'## ' + content?.query}</Markdown>
        {content?.responses.map((response, index) => (
          <View key={index} style={styles.responseContainer}>
            <View style={styles.responseStatusBar}>
              <Text>
                {index + 1} of {content.responses.length}
              </Text>
              <View style={styles.btnContainer}>
                <TouchableOpacity onPress={() => handleCopy(content.query, response)}>
                  <Icon name={'copy'} size={18} color={'#333'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleShare(content.query, response)}>
                  <Icon name={'arrow-up-from-bracket'} size={18} color={'#333'} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{padding: 10}}>
              <Markdown style={markdownStyle}>{response}</Markdown>
            </View>
          </View>
        ))}
      </ScrollView>
      <Pressable onPress={onClose} style={styles.btnStyle}>
        <Text style={{color: '#fff', fontSize: 18}}>Close</Text>
      </Pressable>
    </View>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  responseContainer: {
    backgroundColor: '#eee',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BBB',
    marginVertical: 10,
    overflow: 'hidden',
  },
  responseStatusBar: {
    backgroundColor: '#CCC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingRight: 10
  },
  btnStyle: {
    position: 'absolute',
    bottom: 20,
    width: '70%',
    backgroundColor: '#dc6f6f',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 25,
  },
});
