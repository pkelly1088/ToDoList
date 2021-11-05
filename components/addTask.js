import React, { useState, useEffect} from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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


    useEffect(() => {
        createTable();
    }, []);

  const createTable = () => {
    db.transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS toDoList (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, complete BOOLEAN NOT NULL CHECK (complete IN (0, 1)))')
    })
  }

  const [task, setTask] = useState('');
  const [taskObject, setTaskObject] = useState({
    id: null,
    task: '',
    complete: false,
    edit: false,
  })
  const [taskItems, setTaskItems] = useState([]);


  const saveTaskObject = (text) => {
    setTask(text);
    setTaskObject({
      id: null, 
      task: text ,
      complete: false,
      edit: false
     });
  }

  const handleAddTask = () => {
    Keyboard.dismiss();
    db.transaction((tx)=>{
      tx.executeSql(
        'INSERT INTO toDoList (task, complete) VALUES (?,?)',
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
      complete: false,
      edit: false
    })
    navigation.navigate({
      name: 'ToDoList',
      merge: true,
    });
  }

    const navigation = useNavigation();

    return(
    <View style={styles.container}>
        <View style={styles.addWrapper}>
            <Text style={styles.addTitle}>Add A Task</Text>
            <View style={styles.addItemSection}>
                <Text style={styles.addText}>Task</Text>
                <TextInput style={styles.input} value={task} placeholder={'Enter Task Here'} onChangeText={(text) => saveTaskObject(text)}/>
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
});

export default addTask;