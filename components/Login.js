import React, {useState} from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {

  const [userName, setUserName] = useState('');

  const navigation = useNavigation();

  const handleUserLogin = () => {
    Keyboard.dismiss();
    if (userName === ''){
      Alert.alert('Please enter a name to access to do list.')
    } else if (userName !== ''){
      navigation.navigate('To Do List', {
        paramKey: userName,
      });
    }
  }

    return(
    <View style={styles.loginContainer}>
      <View style={styles.loginWrapper}>
        <Text style={styles.loginTitle}>What is your name?</Text>
        <TextInput style={styles.input} value={userName} placeholder={'Enter Name Here'} onChangeText={(text) => setUserName(text)}/>
        <Pressable style={styles.loginButton} onPress={() => handleUserLogin()}>
          <Text style={styles.loginText}>Submit</Text>
        </Pressable>
      </View>
    </View>
    );
  };

  const styles = StyleSheet.create({
    input: {
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      borderRadius: 60,
      borderColor: '#C0C0C0',
      borderWidth: 1,
      width: 250,
    },
  loginContainer: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  loginWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#57B9E2',
    marginHorizontal: 20,
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#1D1D1D',
  },
  });
  export default Login;