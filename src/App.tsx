import {
  Alert,
  BackHandler,
  DrawerLayoutAndroid,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';

//navigation
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

//screens
import TextSearch from './screens/TextSearch';
import ImageSearch from './screens/ImageSearch';
import About from './screens/About';
import SplashScreen from './screens/SplashScreen';
import NavigationView from './Components/NavigationView';

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
  const drawer = useRef<DrawerLayoutAndroid>(null);

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

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={'left'}
      renderNavigationView={() => <NavigationView drawerRef={drawer}/>}>
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
              {/* <Tab.Screen
                name="About"
                component={About}
                options={{
                  title: 'About',
                }}
              /> */}
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

});
