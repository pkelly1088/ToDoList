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

const editTask = ({route}) => {


    useEffect(() => {
        console.log("Focused: ", isFocused);
        getData();
  }, [isFocused]);

    const isFocused = useIsFocused();

    const getData = () => {
        db.transaction((tx) => {
              tx.executeSql(
                'SELECT * FROM toDoList',
                [],
                (tx, results) => {
                  if(results.rows.length > 0){
                    let itemsCopy = [];
                    for (let i = 0; i < results.rows.length; i++) {
                      let tempTaskObject = {
                        id: results.rows.item(i).id,
                        task: results.rows.item(i).task,
                        complete: intToBoolean(results.rows.item(i).complete),
                        edit: false,
                      };
                      itemsCopy.push(tempTaskObject);
                    }
                    setTaskItems(itemsCopy);
                  }
                }
              )
            })
    }

  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  const navigation = useNavigation();

  const intToBoolean = (object) => {
    if (object === 1){
      return true
    } else if (object === 0){
      return false
    }
  }

  const updateTaskObject = (text) => {
    setTask(text);
    let myTask = taskItems[route.params.index];
    myTask.task = text;
    let itemsCopy = [...taskItems];
    itemsCopy.splice(route.params.index, 1, myTask);
    setTaskItems(itemsCopy);
  }
    
  const handleUpdateTask = () => {
    Keyboard.dismiss();
    let myTask = taskItems[route.params.index];
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE toDoList SET task=? WHERE ID=?`,
        [myTask.task, myTask.id],
        () => {Alert.alert('Success', `Task updated to ${myTask.task}`) },
        error => {console.log('Error!', error)}
      )
    })
    myTask.edit = false;
    let itemsCopy = [...taskItems];
    itemsCopy.splice(route.params.index, 1, myTask);
    setTaskItems(itemsCopy);
    navigation.navigate({
        name: 'ToDoList',
        merge: true,
      });
    }

    return(
    <View style={styles.container}>
        <View style={styles.addWrapper}>
            <Text style={styles.addTitle}>Edit Task</Text>
            <View style={styles.addItemSection}>
                <Text style={styles.addText}>Task</Text>
                <TextInput style={styles.input} defaultValue={route.params.task} placeholder={'Enter Task Here'} onChangeText={(text) => updateTaskObject(text)}/>
                <Pressable style={styles.addButton} onPress={() => handleUpdateTask()}>
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

export default editTask;