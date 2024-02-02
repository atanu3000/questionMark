import {
  Alert,
  BackHandler,
  DrawerLayoutAndroid,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface QueryResponse {
  query: string;
  responses: string[];
}

// Save data to local storage
export const saveData = async (query: string, response: string) => {
  try {
    const existingData = await AsyncStorage.getItem('questionMark app data');
    let existingQueryResponses: QueryResponse[] = [];

    if (existingData) {
      existingQueryResponses = JSON.parse(existingData);

      if (!Array.isArray(existingQueryResponses)) {
        existingQueryResponses = [];
      }
    }

    const existingQueryIndex = existingQueryResponses.findIndex(
      item => item.query === query,
    );

    if (existingQueryIndex !== -1) {
      existingQueryResponses[existingQueryIndex].responses.push(response);
    } else {
      existingQueryResponses.push({query, responses: [response]});
    }

    await AsyncStorage.setItem(
      'questionMark app data',
      JSON.stringify(existingQueryResponses),
    );
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Retrieve data from AsyncStorage
const fetchData = async (): Promise<QueryResponse[]> => {
  const existingData = await AsyncStorage.getItem('questionMark app data');
  const parsedData = existingData ? JSON.parse(existingData) : [];

  return parsedData;
};

const App = () => {
  const drawer = useRef<DrawerLayoutAndroid>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<QueryResponse[]>([]);

  useEffect(() => {
    const backButton = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit ?', [
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

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchData();
      setData(data);
    };
    const intervalId = setInterval(fetch, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const navigationView = () => (
    <View>
      <View style={styles.navigationContainer}>
        <Text style={styles.paragraph}>Recents</Text>
        <TouchableOpacity
          style={styles.recentBtn}
          onPress={() => drawer.current?.closeDrawer()}>
          <Icon name="angle-left" size={18} color={'#FFF'} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={({item}: {item: QueryResponse}) => (
          <View
            style={{
              padding: 10,
            }}>
            <Text style={styles.queryStyle}>
              {item.query} ({item.responses.length})
            </Text>
          </View>
        )}
        keyExtractor={item => item.query}
      />
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={'left'}
      renderNavigationView={navigationView}>
      <StatusBar backgroundColor={ThemeColor} />
      {isLoading ? (
        <SplashScreen setIsLoading={setIsLoading} />
      ) : (
        <>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => drawer.current?.openDrawer()}
              style={{paddingHorizontal: 18}}>
              <Icon name="bars-staggered" size={22} color={'#FFF'} />
            </TouchableOpacity>
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
    </DrawerLayoutAndroid>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColor,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingText: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 24,
  },
  navigationContainer: {
    backgroundColor: ThemeColor,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  queryStyle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  paragraph: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  recentBtn: {
    backgroundColor: '#FFFFFF55',
    borderRadius: 25,
    padding: 6,
    paddingHorizontal: 10,
  },
});
