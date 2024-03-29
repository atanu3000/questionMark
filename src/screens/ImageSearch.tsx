import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
import { saveData } from '../Components/NavigationView';

const genAI = new GoogleGenerativeAI(API_KEY);

const ImageSearch: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<ImageType[]>([]);
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const selectImages = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      multiple: true,
      waitAnimationEnd: false,
      cropping: true,
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
        return Snackbar.show({
          text: error.message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#D24545',
        });
      });
  };

  const openCamera = async () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        setSelectedImages([image]);
      })
      .catch(err => {
        console.log(err);
        return Snackbar.show({
          text: err.message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#D24545',
        });
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
      throw error; 
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
      });
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
      const response = result.response;
      setResponse(response.text());
      saveData(query, response.text(), selectedImages.map(image => image.path))
    } catch (error) {
      console.error('An error occurred:', error);
      setSelectedImages([]);
      return Snackbar.show({
        text: 'This image is not compatible. Please try another!',
        duration: 5000, 
        backgroundColor: '#D24545',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    ImagePicker.clean()
      .then(() => {
        setResponse('');
        setQuery('');
        setSelectedImages([]);
      })
      .catch();
  };

  return (
    <View style={styles.container}>
      {selectedImages.length === 0 ? (
        <View>
          <View style={styles.selectImages}>
            <TouchableOpacity
              onPress={selectImages}
              style={styles.selectImagesBtn}>
              <Icon name="plus" color={'#FFFFFF'} size={44} />
            </TouchableOpacity>
            <Text>Or</Text>
            <TouchableOpacity onPress={openCamera} style={styles.selectImagesBtn}>
              <Icon name="camera" color={'#FFFFFF'} size={44} />
            </TouchableOpacity>
          </View>
          <Text style={{textAlign: 'center', marginTop: 20
        }}>Please choose images under 2MB for better compatibility</Text>
        </View>
      ) : (
        <>
          <TextInputView handleInput={setQuery} getResponse={getResponse} />
          <ResponseView
            isLoading={isLoading}
            images={selectedImages.map(image => image.path)}
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
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    height: Dimensions.get('window').height - 94,
    paddingBottom: 10,
  },
  selectImages: {
    flexDirection: 'row',
    gap: 20,
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
