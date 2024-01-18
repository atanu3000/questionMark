import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Markdown from 'react-native-markdown-display';
import {markdownStyle} from '../markdownStyle';
import Icon from 'react-native-vector-icons/FontAwesome6';

interface ResponseViewProps {
  isLoading: boolean;
  response: string;
  getResponse: () => void;
}

const ResponseView: React.FC<ResponseViewProps> = ({
  isLoading,
  response,
  getResponse,
}) => {
  return (
    <ScrollView style={styles.responseContainer}>
      {isLoading === true ? (
        <ActivityIndicator
          style={{paddingTop: 50}}
          size="large"
          color="#ef8585"
        />
      ) : (
        response && (
          <>
            <Markdown style={markdownStyle}>{response}</Markdown>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity style={styles.regenerate} onPress={getResponse}>
                <Icon name="arrows-rotate" color={'#FFFFFF'} size={20} />
                <Text style={styles.regenerateText}>Regenerate</Text>
              </TouchableOpacity>
            </View>
          </>
        )
      )}
    </ScrollView>
  );
};

export default ResponseView;

const styles = StyleSheet.create({
  responseContainer: {
    paddingHorizontal: 12,
    paddingBottom: 300,
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
    marginTop: 20,
  },
  regenerateText: {
    paddingBottom: 2,
    fontWeight: '500',
  },
});
