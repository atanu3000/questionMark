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
  StatusBar,
  Image,
  Dimensions,
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
  ToastAndroid.show('Copied successfully', ToastAndroid.SHORT);
};

const handleShare = (query: string, response: string) => {
  Share.share({
    message: query + '\n\n' + response.replace(/\*\*/g, '*'),
  });
};

const PreviewScreen: React.FC<PreviewScreenProps> = ({onClose, content}) => {
  return (
    <>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View style={{paddingHorizontal: 0, flex: 1}}>
        <ScrollView contentContainerStyle={{padding: 10, paddingBottom: 80}}>
          <Markdown style={markdownStyle}>{'## ' + content?.query}</Markdown>
          {content?.imgPath && (
            <View
              style={[
                content?.imgPath.length === 1
                  ? {alignItems: 'center'}
                  : styles.imageContainer
              ]}>
              {content?.imgPath.map(image => (
                <Image
                  key={image}
                  source={{uri: image}}
                  style={styles.imageStyle}
                />
              ))}
            </View>
          )}
          {content?.responses.map((response, index) => (
            <View key={index} style={styles.responseContainer}>
              <View style={styles.responseStatusBar}>
                <Text
                  style={{ backgroundColor: '#eeeeeeaa', padding: 5, borderRadius: 15}}>
                  {index + 1} of {content.responses.length}
                </Text>
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    onPress={() => handleCopy(content.query, response)}
                    style={{ backgroundColor: '#eeeeeeaa', padding: 10, borderRadius: 20}}>
                    <Icon name={'copy'} size={18} color={'#333'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleShare(content.query, response)}
                    style={{ backgroundColor: '#eeeeeeaa', padding: 10, borderRadius: 20}}>
                    <Icon
                      name={'arrow-up-from-bracket'}
                      size={18}
                      color={'#333'}
                    />
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
    </>
  );
};

export default PreviewScreen;

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageStyle: {
    width: width / 2 - 16,
    height: 130,
    borderRadius: 10,
  },
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingRight: 10,
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
