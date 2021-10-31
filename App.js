import React, {useState} from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import Login from './components/Login';
import ToDoList from './components/ToDoList';

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
      </Stack.Navigator>
    </NavigationContainer>

  );
}
