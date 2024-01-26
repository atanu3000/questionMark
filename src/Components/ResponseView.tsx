import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Markdown from 'react-native-markdown-display';
import {markdownStyle} from '../markdownStyle';
import Icon from 'react-native-vector-icons/FontAwesome6';
import LottieView from 'lottie-react-native';

interface ResponseViewProps {
  isLoading: boolean;
  response: string;
  images?: string[];
  getResponse: () => void;
  clearData?: () => void;
}

const width = Dimensions.get('window').width;

const ResponseView: React.FC<ResponseViewProps> = ({
  isLoading,
  response,
  images,
  getResponse,
  clearData,
}) => {
  const scrollViewRef = useRef<ScrollView>();
  const [showGoToBottomButton, setShowGoToBottomButton] = useState<boolean>(false);

  const handleScroll = (event: {
    nativeEvent: {
      contentOffset: {y: number};
      layoutMeasurement: {height: number};
      contentSize: {height: number};
    };
  }) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    const threshold = 150;
    const isCloseToBottom = contentHeight - screenHeight - scrollPosition < threshold;

    setShowGoToBottomButton(!isCloseToBottom);
  };

  const handleGoToBottom = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        ref={scrollViewRef as React.RefObject<ScrollView>}
        onScroll={handleScroll}
        contentContainerStyle={styles.responseContainer}
        showsVerticalScrollIndicator={false}>
        {images && (
          <>
            <View
              style={[
                images.length === 1
                  ? {alignItems: 'center'}
                  : styles.imageContainer,
              ]}>
              {images.map(image => (
                <Image
                  key={image}
                  source={{uri: image}}
                  style={styles.imageStyle}
                />
              ))}
            </View>
            {!response && !isLoading && (
              <View style={styles.chooseAnother}>
                <TouchableOpacity
                  style={[styles.clear, {marginTop: 15}]}
                  onPress={clearData}>
                  <Text style={{fontWeight: '500'}}>Choose another image</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        {isLoading === true ? (
          <View style={{alignItems: 'center'}}>
            <LottieView
              source={require('../assets/skeleton frame.json')}
              style={{width: '100%', height: 300}}
              autoPlay
              loop
            />
            <LottieView
              source={require('../assets/skeleton frame.json')}
              style={{width: '100%', height: 300}}
              autoPlay
              loop
            />
          </View>
        ) : (
          response && (
            <>
              <Markdown style={markdownStyle}>{response}</Markdown>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.regenerate}
                  onPress={getResponse}>
                  <Icon name="arrows-rotate" color={'#FFFFFF'} size={20} />
                  <Text style={styles.regenerateText}>Regenerate</Text>
                </TouchableOpacity>
                {clearData && (
                  <TouchableOpacity style={styles.clear} onPress={clearData}>
                    <Text style={{fontWeight: '500'}}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )
        )}
      </ScrollView>
      {response && showGoToBottomButton && (
        <TouchableOpacity
          style={styles.goToBottomButton}
          onPress={handleGoToBottom}>
          <Icon name="angles-down" color={'#FFF'} size={16} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ResponseView;

const styles = StyleSheet.create({
  responseContainer: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  imageStyle: {
    width: width / 2 - 16,
    height: 130,
    borderRadius: 10,
  },
  chooseAnother: {
    alignItems: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  regenerate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ef8585',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  clear: {
    alignItems: 'center',
    backgroundColor: '#ef8585',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  regenerateText: {
    paddingBottom: 2,
    fontWeight: '500',
  },
  goToBottomButton: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#E06765',
    padding: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
});
