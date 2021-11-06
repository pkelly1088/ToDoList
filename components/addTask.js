import React, { useState, useEffect} from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, Keyboard, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';


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
  
    const db = SQLite.openDatabase("toDoList.db");
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
  const [taskObject, setTaskObject] = useState({
    id: null,
    task: '',
    photo: null,
    complete: false,
  })
  const [taskItems, setTaskItems] = useState([]);
  const [photo, setPhoto] = useState(null);

  const navigation = useNavigation();

  const savePhoto = () => {
    try {
      if(route.params.photo){
        setPhoto(route.params.photo);
        // console.log(route.params.photo);
      }  
    } catch (error) {
      console.log(error);  
    }
  }

  const saveTaskObject = (text) => {
    setTask(text);
    setTaskObject({
      id: null, 
      task: text ,
      photo: JSON.stringify(photo),
      complete: false,
     });
  }

  const handleAddTask = () => {
    Keyboard.dismiss();
    db.transaction((tx)=>{
      tx.executeSql(
        'INSERT INTO toDoList (task, photo, complete) VALUES (?,?,?)',
        [task, 0],
        () => { Alert.alert('Success', `${taskObject.task} was added to your to do list.`)},
        (error) => {console.log('Error Saving Task', error)}
      )
    });
    setTaskItems([...taskItems, taskObject]);
    setTask('');
    setTaskObject({
      id: null,
      task: '',
      photo: null,
      complete: false,
    })
    navigation.goBack();
  }

    return(
    <View style={styles.container}>
        <View style={styles.addWrapper}>
            <Text style={styles.addTitle}>Add A Task</Text>
            <View style={styles.addItemSection}>
                <Text style={styles.addText}>Task</Text>
                {/* {photo !== null
                        ? <View style={styles.photoSquare}>
                            <ImageBackground source={{uri: photo && photo.uri}} style={styles.photoView}/>
                          </View>
                        : <View style={styles.photoSquare}>

                        </View>
                      } */}
                <TextInput style={styles.input} value={task} placeholder={'Enter Task Here'} onChangeText={(text) => saveTaskObject(text)}/>
                <Pressable style={styles.addButton} onPress={() => navigation.navigate('My Camera', {
                  startingLocation: 'Add Task',
                })}>
                    <Text style={styles.addBtnText}>Take A Picture</Text>
                </Pressable>
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
      photoSquare: {
        height: '40%',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
      }
});

export default addTask;