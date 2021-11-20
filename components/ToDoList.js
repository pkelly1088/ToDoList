import React, { useState, useEffect} from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Pressable, Alert, ScrollView, FlatList, TextInput } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


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

const ToDoList = ({ route }) => {

  const navigation = useNavigation();

  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("Focused: ", isFocused);
    getData();
    createTable();
  }, [isFocused]);

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS toDoList (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, photo TEXT, complete BOOLEAN NOT NULL CHECK (complete IN (0, 1)))')
    })
  }


  const [taskItems, setTaskItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');

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
                      photo: JSON.parse(results.rows.item(i).photo),
                      complete: intToBoolean(results.rows.item(i).complete),
                    };
                    itemsCopy.push(tempTaskObject);
                  }
                  setTaskItems(itemsCopy);
                  setFilteredData(itemsCopy);
                }
              }
            )
          })
  }

  const markTaskComplete = (index) => {
    let myTask = taskItems[index];
    let taskId = myTask.id
    if (myTask.complete === false) {
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE toDoList SET complete=1 WHERE ID=?`,
          [taskId],
          () => {Alert.alert(`Success`, `${myTask.task} complete!`) },
          error => {console.log(error)}
        )
      })
      myTask.complete = true;
      let itemsCopy = [...taskItems];
      itemsCopy.splice(index, 1, myTask);
      setTaskItems(itemsCopy);
      setFilteredData(itemsCopy);
    } else if (myTask.complete === true) {
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE toDoList SET complete=0 WHERE ID=?`,
          [taskId],
          () => {Alert.alert('Task changed to incomplete') },
          error => {console.log(error)}
        )
      })
      myTask.complete = false
      let itemsCopy = [...taskItems];
      itemsCopy.splice(index, 1, myTask);
      setTaskItems(itemsCopy);
      setFilteredData(itemsCopy);
    }
  }

  const intToBoolean = (object) => {
    if (object === 1){
      return true
    } else if (object === 0){
      return false
    }
  }

  const deleteTask = (index) => {
    let itemsCopy = [...taskItems];
    let myTask = itemsCopy[index];
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM toDoList WHERE ID=?`,
        [myTask.id],
        () => {Alert.alert(`Task ${myTask.task} deleted`) },
        error => {console.log(error)}
      )
    })
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
    setFilteredData(itemsCopy);
  }

  const check = "\u2713";

  const searchFilter = (text) => {
    if (text) {
      const newData = taskItems.filter((item) => {
        const itemData = item.task ? item.task.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(taskItems);
      setSearch(text);
    }
  }

  const ItemView = ({item, index}) => {
    return (
      <View key={(index).toString()} style={styles.item}>
                    <View style={styles.itemLeft}>
                      <TouchableOpacity onPress={() => markTaskComplete(index)}>
                      {item.complete === true
                        ? <View style={styles.squareGreen}><Text>{ check }</Text></View>
                        : <View style={styles.squareGrey}></View>
                      }
                      </TouchableOpacity>
                      <Text style={styles.itemText}>{item.task}</Text>
                    </View>
                    <Pressable style={styles.updateButton} onPress={() => navigation.navigate('Edit Task', {
                      index: index,
                      task: item.task,
                      photo: item.photo,
                    })}>
                      <Text style={styles.updateText}>View</Text>
                    </Pressable>
                    <Pressable style={styles.deleteButton} onPress={() => deleteTask(index)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </Pressable>
                  </View>
    )
  }

    return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#E8EAED'}}>
      <ScrollView style={styles.container}>
        <View style={styles.tasksWrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.sectionTitle}>{route.params.paramKey}'s Tasks</Text>
            <Pressable style={styles.taskButton} onPress={() => navigation.navigate('Add Task')}>
              <Text style={styles.deleteText}>Add Task</Text>
            </Pressable>
          </View>
          <TextInput 
            style={styles.input} 
            value={search} 
            placeholder='Search Here'
            underlineColorAndroid='transparent'
            onChangeText={(text) => searchFilter(text)} 
            />
          <View style={styles.items}>
          <FlatList 
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ItemView}
            />
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.writeTaskWrapper}
        >
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8EAED',
    },
    tasksWrapper: {
      paddingTop: 12,
      paddingHorizontal: 24,
    },
    titleWrapper: {
      flexDirection: 'row',
      justifyContent:'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      paddingBottom: 24,
    },
    items: {
      marginTop: 12,
    },
    writeTaskWrapper: {
      position: 'absolute',
      bottom: 60,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
  
    },
    input: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: '#fff',
      borderRadius: 4,
      borderColor: '#C0C0C0',
      borderWidth: 1,
      marginBottom: 16,
    },
    updateInput: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: '#fff',
      borderRadius: 60,
      borderColor: '#C0C0C0',
      borderWidth: 1,
      width: 100,
    },
    addWrapper: {
      width: 60,
      height: 60,
      backgroundColor: '#fff',
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#E8E8E8',
      borderWidth: 1,
  
    },
    item: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      
  },
  itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
  },
  squareGreen: {
      width: 24,
      height: 24,
      backgroundColor: 'rgba(93, 246, 85, 0.4)',
      alignItems:'center',
      justifyContent: 'center',
      borderRadius: 5,
      marginRight: 15,
  },
  squareGrey: {
    width: 24,
    height: 24,
    backgroundColor: '#C0C0C0',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
    width: 100,
  },
  textContainer: {
    maxWidth: '80%',
  },
  circular: {
      width: 12,
      height: 12,
      borderColor: '#55BDF6',
      borderWidth: 2,
      borderRadius: 5,
  },
  editText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  updateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#57B9E2',
    marginHorizontal: 20,
  },
  updateText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#1D1D1D',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#E26F57',
  },
  deleteText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#1D1D1D',
  },
  taskButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#7dce7b',
  },
  addText: {
    fontSize: 36,
    lineHeight: 36,
  },
  searchText: {
    padding: 15,
  }
  });
export default ToDoList;