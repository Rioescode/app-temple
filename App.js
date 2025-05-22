import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '@rneui/themed';

import HomeScreen from './src/screens/HomeScreen';
import ResumeFormScreen from './src/screens/ResumeFormScreen';
import ResumePreviewScreen from './src/screens/ResumePreviewScreen';
import SavedResumesScreen from './src/screens/SavedResumesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2c3e50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Resume Builder' }}
          />
          <Stack.Screen 
            name="ResumeForm" 
            component={ResumeFormScreen}
            options={{ title: 'Create Resume' }}
          />
          <Stack.Screen 
            name="ResumePreview" 
            component={ResumePreviewScreen}
            options={{ title: 'Preview Resume' }}
          />
          <Stack.Screen 
            name="SavedResumes" 
            component={SavedResumesScreen}
            options={{ title: 'Saved Resumes' }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeProvider>
  );
} 