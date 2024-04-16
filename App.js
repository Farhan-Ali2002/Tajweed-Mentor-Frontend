import * as React from 'react';
import { NavigationContainer,  DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/home';
import RecordScreen from './screens/recordscreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TajweedDetailsScreen from './screens/tajweeddetailscreen';
import { ImageBackground } from 'react-native';
import ThemeProvider from '@react-navigation/native';
import FeedbackScreen from './screens/feedbackscreen';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


const customTheme = {
  ...DefaultTheme,
  
  colors: {
    ...DefaultTheme.colors,
    primary: 'white', // Golden color
    // background: '#b48d07', // Dark green color
    text: 'white', // White text color
    
  },
};

function Root() {
  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={{
      headerStyle: {
        backgroundColor: '#06205a', // Change app bar background color
      },
      drawerStyle: {
        backgroundColor: '#1e4681', // Set drawer background color
      },
      headerTintColor: 'white', // Change app bar text color
    }}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Recite & Learn" component={RecordScreen} />
        <Drawer.Screen name="Feedback" component={FeedbackScreen} />
        {/* Additional screens here */}
      </Drawer.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer theme={customTheme}>
      <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#06205a', // Change app bar background color
        }}}>
        <Stack.Screen
          options={{
            headerShown: false, // Hide header for Root screen
            // Other options for Root screen (if needed)
          }}
          name="Root"
          component={Root}
          
        />
        <Stack.Screen
          options={{
            title: 'Tajweed Lessons', // Set title for TajweedDetails screen
            // Other options for TajweedDetails screen (if needed)
          }}
          name="TajweedDetails"
          component={TajweedDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
