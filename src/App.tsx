import {
  Alert,
  BackHandler,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

//navigation
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

//screens
import TextSearch from './screens/TextSearch';
import ImageSearch from './screens/ImageSearch';
import About from './screens/About';
import SplashScreen from './screens/SplashScreen';

export type RootMaterialTabParamList = {
  TextSearch: undefined;
  ImageSearch: undefined;
  About: undefined;
};

const Tab = createMaterialTopTabNavigator<RootMaterialTabParamList>();
const ThemeColor = '#D24545';

const getTabWidth = (tabName: string) => {
  return tabName === 'ImageSearch' ? 200 : undefined;
};

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const backButton = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back ?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            BackHandler.exitApp(), setIsLoading(true);
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backButton,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <>
      <StatusBar backgroundColor={ThemeColor} />
      {isLoading ? (
        <SplashScreen setIsLoading={setIsLoading} />
      ) : (
        <>
          <View style={styles.container}>
            <Text style={styles.headingText}>Question Mark</Text>
          </View>
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="TextSearch"
              screenOptions={{
                tabBarStyle: {backgroundColor: ThemeColor},
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: '#E6BAA3',
                tabBarLabelStyle: {
                  fontWeight: '500',
                  fontSize: 15,
                  textTransform: 'capitalize',
                  width: getTabWidth('ImageSearch'),
                },
                tabBarIndicatorStyle: {
                  backgroundColor: '#FFFFFF',
                  height: 3,
                },
              }}>
              <Tab.Screen
                name="TextSearch"
                component={TextSearch}
                options={{title: 'Normal'}}
              />
              <Tab.Screen
                name="ImageSearch"
                component={ImageSearch}
                options={{title: 'Vision'}}
              />
              <Tab.Screen
                name="About"
                component={About}
                options={{
                  title: 'About',
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </>
      )}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColor,
    paddingTop: 14,
  },
  headingText: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 24,
    paddingLeft: 18,
  },
});
