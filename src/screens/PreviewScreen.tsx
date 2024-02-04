// PreviewScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
// import { RootStackParamList } from '../Stack/PreviewStack';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';

interface PreviewScreenProps {
  route: {
    params: {
      query: string;
      responses: string[];
    };
  };
}

// type PreviewScreenProps = 

const PreviewScreen: React.FC<PreviewScreenProps> = ({ route }) => {
  const { query, responses } = route.params;

  return (
    <View>
      <Text>Preview Screen</Text>
      <Text>{`Query: ${query}`}</Text>
      <Text>{`Responses: ${responses.join(', ')}`}</Text>
    </View>
  );
};

export default PreviewScreen;
