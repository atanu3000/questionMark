// // MainStack.tsx
// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import NavigationView from '../Components/NavigationView';
// import PreviewScreen from '../screens/PreviewScreen';

// export type RootStackParamList = {
//     NavigationView: undefined,
//     PreviewScreen: {params: {
//         query: string;
//         responses: string[];
//       };}
// }


// const Stack = createStackNavigator<RootStackParamList>();

// const MainStack: React.FC = () => {
//     const drawerRef = React.useRef<DrawerLayoutAndroid>(null);
//   return (
//     <Stack.Navigator initialRouteName="NavigationView">
//       <Stack.Screen
//         name="NavigationView"
//         component={NavigationView}
//         options={{
//           header: () => null, // Hide header for NavigationView
//         }}
//       />
//       <Stack.Screen name="PreviewScreen" component={PreviewScreen} />
//     </Stack.Navigator>
//   );
// };

// export default MainStack;
