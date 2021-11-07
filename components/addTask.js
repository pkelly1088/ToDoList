import React, { useState, useEffect} from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, Keyboard, Alert, ImageBackground } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';


function openDatabase() {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }
  
    const db = SQLite.openDatabase("toDoList3.db");
    return db;
  }
  
  const db = openDatabase();

const addTask = ({route}) => {

  const isFocused = useIsFocused();


    useEffect(() => {
        console.log("Focused: ", isFocused);
        createTable();
        savePhoto();
    }, [isFocused]);

  const createTable = () => {
    db.transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS toDoList (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, photo TEXT, complete BOOLEAN NOT NULL CHECK (complete IN (0, 1)))')
    })
  }

  const [task, setTask] = useState('');
  const [photo, setPhoto] = useState(null);

  const navigation = useNavigation();

  const savePhoto = () => {
    try {
      if(route.params.newPhoto !== undefined){
        setPhoto(route.params.newPhoto);
      } else {
        setPhoto(null);
      }
    } catch (error) {
      console.log(error);  
    }
  }

  const pickFromGallery = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        console.log(result);

        if (!result.cancelled) {
          setPhoto(result);
        }
      }
    }
}

  const handleAddTask = () => {
    Keyboard.dismiss();
    db.transaction((tx)=>{
      tx.executeSql(
        'INSERT INTO toDoList (task, photo, complete) VALUES (?,?,?)',
        [task, JSON.stringify(photo), 0],
        () => { Alert.alert('Success', `${task} was added to your to do list.`)},
        (error) => {console.log('Error Saving Task', error)}
      )
    });
    setTask('');
    navigation.goBack();
  }

    return(
    <View style={styles.container}>
        <View style={styles.addWrapper}>
            <Text style={styles.addTitle}>Add A Task</Text>
            <View style={styles.addItemSection}>
                <Text style={styles.addText}>Task</Text>
                <View style={styles.photoContainer}>
                {photo !== null
                        ? <View style={styles.photoSquare}>
                            <ImageBackground source={{uri: photo && photo.uri}} style={styles.photoView}/>
                          </View>
                        : <View style={styles.photoSquare}>
                            <Text style={styles.photoText}>No Photo</Text>
                          </View>
                }
                </View>
                <TextInput style={styles.input} value={task} placeholder={'Enter Task Here'} onChangeText={(text) => setTask(text)}/>
                <View style={styles.btnContainer}>
                  <Pressable style={styles.addButton} onPress={() => navigation.navigate('My Camera', {
                    startingLocation: 'Add Task',
                  })}>
                    <Text style={styles.addBtnText}>Take A Picture</Text>
                  </Pressable>
                  <Pressable style={styles.addButton} onPress={() => pickFromGallery()}>
                    <Text style={styles.addBtnText}>Pick From Gallery</Text>
                  </Pressable>
                </View>
                <Pressable style={styles.addButton} onPress={() => handleAddTask()}>
                    <Text style={styles.addBtnText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8EAED',
    },
    addWrapper: {
      paddingTop: 24,
      paddingHorizontal: 20,
    },
    addTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    addItemSection: {
        marginTop: 12,
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 60,
        borderColor: '#C0C0C0',
        borderWidth: 1,
    },
    addButton: {
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
    addBtnText: {
      paddingVertical: 6,
      paddingHorizontal: 16,
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: '#1D1D1D',
      alignItems: 'center',
      justifyContent: 'center', 
    },
    addText: {
      fontSize: 20,
      lineHeight: 30,
      letterSpacing: 0.25,
      marginBottom: 12,
    },
    photoContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    photoSquare: {
      height: 200,
      width: 200,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'grey',
      borderWidth: 1,
      borderStyle: 'solid',
    },
    photoView: {
      width: "100%",
      height: '100%',
    },
    photoText: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.25,
      opacity: 0.7,
      alignSelf: 'center',
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    }
});

export default addTask;