import React from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import Login from './components/Login';
import ToDoList from './components/ToDoList';
import addTask from './components/addTask';
import editTask from './components/editTask';

export default function App() {

const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name='Login' 
          component={Login} />
        <Stack.Screen 
          name='ToDoList' 
          component={ToDoList} 
          />
        <Stack.Screen 
          name='addTask' 
          component={addTask} 
          />
        <Stack.Screen 
          name='editTask' 
          component={editTask} 
          />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
