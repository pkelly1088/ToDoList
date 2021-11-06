import React from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import Login from './components/Login';
import ToDoList from './components/ToDoList';
import addTask from './components/addTask';
import editTask from './components/editTask';
import MyCamera from './components/MyCamera';
import PhotoPreview from './components/PhotoPreview';

export default function App() {

const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name='Login' 
          component={Login} />
        <Stack.Screen 
          name='To Do List' 
          component={ToDoList} 
          />
        <Stack.Screen 
          name='Add Task' 
          component={addTask} 
          />
        <Stack.Screen 
          name='Edit Task' 
          component={editTask} 
          />
        <Stack.Screen 
          name='My Camera' 
          component={MyCamera} 
          />
        <Stack.Screen 
          name='Photo Preview' 
          component={PhotoPreview} 
          />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
