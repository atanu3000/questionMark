import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';

//navigation
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

//screens
import TextSearch from './screens/TextSearch';
import ImageSearch from './screens/ImageSearch';

export type RootMaterialTabParamList = {
  TextSearch: undefined;
  ImageSearch: undefined;
};

const Tab = createMaterialTopTabNavigator<RootMaterialTabParamList>();

const App = () => {
  return (
    <>
      <StatusBar backgroundColor={'#444444'} />
      <View style={styles.container}>
        <Text style={styles.headingText}>Question Mark</Text>
      </View>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="TextSearch"
          screenOptions={{
            tabBarStyle: {backgroundColor: '#444444'},
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: '#aaaaaa',
            tabBarIndicatorStyle: {
              backgroundColor: '#FFFFFF', // Set your desired color here
              height: 3, // Adjust the height if needed
            },
          }}>
          <Tab.Screen
            name="TextSearch"
            component={TextSearch}
            options={{title: 'Text Search'}}
          />
          <Tab.Screen
            name="ImageSearch"
            component={ImageSearch}
            options={{title: 'Image Search'}}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#444444',
    paddingVertical: 14,
  },
  headingText: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 22,
    paddingLeft: 18,
  },
});
