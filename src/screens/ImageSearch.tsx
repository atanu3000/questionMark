import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import ImagePicker, {Image as ImageType} from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome6';
import RNFS from 'react-native-fs';

// API specific imports
import {GoogleGenerativeAI} from '@google/generative-ai';
import {API_KEY} from '../../API'; // set up your API key at root directory
import ResponseView from '../Components/ResponseView';
import Snackbar from 'react-native-snackbar';

const ImageSearch: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<ImageType[]>([]);
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const width = Dimensions.get('window').width;
  const genAI = new GoogleGenerativeAI(API_KEY);

  const selectImages = () => {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      mediaType: 'photo',
    })
      .then(images => {
        if (images.length > 2) {
          return Snackbar.show({
            text: 'Maximum 2 images allowed for Vision',
            duration: Snackbar.LENGTH_LONG,  // Ensure Snackbar.LENGTH_LONG is available
            backgroundColor: '#D24545',
          });
      }
        setSelectedImages(images);
        console.log(selectedImages.length);

      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
      });
  };

  // Converts local file information to a GoogleGenerativeAI.Part object.
  async function fileToGenerativePart(path: string, mimeType: string) {
    try {
      const fileContent = await RNFS.readFile(path, 'base64');
      return {
        inlineData: {
          data: fileContent,
          mimeType,
        },
      };
    } catch (error) {
      console.error('Error reading file:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  }

  
  const getResponse = async () => {
    setResponse('');
    setIsLoading(true);
    
    try {
      const model = genAI.getGenerativeModel({model: 'gemini-pro-vision'});
      const imageParts: GenerativePart[] = [];

      await Promise.all(
        // wait for all promises to resolve before continuing
        selectedImages.map(async image => {
          const part = await fileToGenerativePart(image.path, image.mime);
          imageParts.push(part);
        }),
      );

      const result = await model.generateContent([query, ...imageParts]);
      const response = await result.response;
      setResponse(response.text());
    } catch (error) {
      console.error('An error occurred:', error);
      setSelectedImages([]);
      return Snackbar.show({
        text: "This image is not compatible. Please try another!",
        duration: Snackbar.LENGTH_LONG,  // Ensure Snackbar.LENGTH_LONG is available
        backgroundColor: '#D24545',
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      {selectedImages.length === 0 ? (
        <View style={styles.selectImages}>
          <TouchableOpacity
            onPress={selectImages}
            style={styles.selectImagesBtn}>
            <Icon name="plus" color={'#FFFFFF'} size={44} />
          </TouchableOpacity>
        </View>
      ) : (
        selectImages.length <= 4 && (
          <>
            {/* {selectImages.length <= 4 ? () : ()} */}
            <FlatList
              data={selectedImages}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={selectedImages.length === 1 && {alignItems: 'center'}}
              renderItem={({item}) => (
                <Image
                  source={{uri: item.path}}
                  style={[{width: width / 2 - 10, height: 130, margin: 5}]}
                />
              )}
              horizontal={false}
            />
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.inputStyle}
                value={query}
                onChangeText={setQuery}
                placeholder="Ask me any question..."
                autoCorrect={false} // Disable auto-correction
                spellCheck={false} // Disable spell-check
              />
              <TouchableOpacity
                onPress={getResponse}
                style={styles.buttonStyle}>
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
          </>
        )
      )}
    </View>
  );
};

export default ImageSearch;

const styles = StyleSheet.create({
  selectImages: {
    marginTop: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectImagesBtn: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 50,
    backgroundColor: '#ef8585',
    width: 80,
    height: 80,
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
