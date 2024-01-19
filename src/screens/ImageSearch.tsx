import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import ImagePicker, {Image as ImageType} from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome6';
import RNFS from 'react-native-fs';
import Snackbar from 'react-native-snackbar';
import NetInfo from '@react-native-community/netinfo';

// API specific imports
import {GoogleGenerativeAI} from '@google/generative-ai';
import {API_KEY} from '../../API'; // set up your API key at root directory

import ResponseView from '../Components/ResponseView';
import TextInputView from '../Components/TextInputView';

const genAI = new GoogleGenerativeAI(API_KEY);

const ImageSearch: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<ImageType[]>([]);
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

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
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: '#D24545',
          });
        }
        setSelectedImages(images);        
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
      })
    }
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
        text: 'This image is not compatible. Please try another!',
        duration: Snackbar.LENGTH_LONG, // Ensure Snackbar.LENGTH_LONG is available
        backgroundColor: '#D24545',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setResponse('');
    setQuery('');
    setSelectedImages([]);
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
        <>
          <TextInputView handleInput={setQuery} getResponse={getResponse} />
          <ResponseView
            isLoading={isLoading}
            images={selectedImages.map(image => image.path)}
            changeImage={selectImages}
            response={response}
            getResponse={getResponse}
            clearData={clearData}
          />
        </>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 50,
    backgroundColor: '#ef8585',
    width: 80,
    height: 80,
  },
});
