import React, {useState} from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Pressable, Keyboard } from 'react-native';

const ToDoList = ({ route }) => {

  const [task, setTask] = useState('');
  const [taskObject, setTaskObject] = useState({
    task: '',
    complete: false,
    edit: false
  })
  const [taskItems, setTaskItems] = useState([]);

  const markTaskComplete = (index) => {
    let myTask = taskItems[index];
    if (myTask.complete === false) {
      myTask.complete = true;
      let itemsCopy = [...taskItems];
      itemsCopy.splice(index, 1, myTask);
      setTaskItems(itemsCopy);
    } else if (myTask.complete === true) {
      myTask.complete = false
      let itemsCopy = [...taskItems];
      itemsCopy.splice(index, 1, myTask);
      setTaskItems(itemsCopy); 
    }
  }

  const makeEditable = (index) => {
    let myTask = taskItems[index];
    myTask.edit = true;
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1, myTask);
    setTaskItems(itemsCopy);
  }

  const saveTaskObject = (text) => {
    setTask(text);
    setTaskObject({ 
      task: text ,
      complete: false,
      edit: false
     });
  }

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, taskObject]);
    setTask('');
    setTaskObject({
      task: '',
      complete: false,
      edit: false
    })
  }

  const updateTaskObject = (text, index) => {
    let myTask = taskItems[index];
    myTask.task = text;
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1, myTask);
    setTaskItems(itemsCopy);
  }
    
  const handelUpdateTask = (index) => {
    Keyboard.dismiss();
    let myTask = taskItems[index];
    myTask.edit = false;
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1, myTask);
    setTaskItems(itemsCopy);
  }

  const deleteTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  }

  const check = "\u2713";

    return (
      <View style={styles.container}>
  
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>{route.params.paramKey}'s Tasks</Text>
          <View style={styles.items}>
            {
              taskItems.map((item, index) => {
                return (
                  <View key={(index).toString()} style={styles.item}>
                    <View style={styles.itemLeft}>
                      <TouchableOpacity onPress={() => markTaskComplete(index)}>
                      {item.complete === true
                        ? <View style={styles.squareGreen}><Text>{ check }</Text></View>
                        : <View style={styles.squareGrey}></View>
                      }
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.textContainer} onPress={() => makeEditable(index)}>
                        {item.edit === false 
                          ? <Text style={styles.itemText}>{item.task}</Text>
                          : <View style={styles.editText}>
                              <TextInput style={styles.updateInput} defaultValue={item.task} onChangeText={(text) => updateTaskObject(text, index)} />
                              <Pressable style={styles.updateButton} onPress={() => handelUpdateTask(index)}>
                                <Text style={styles.updateText}>Update</Text>
                              </Pressable>
                            </View>
                        }
                      </TouchableOpacity>
                    </View>
                    <Pressable style={styles.deleteButton} onPress={() => deleteTask(index)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </Pressable>
                  </View>
                )
              })
            }
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.writeTaskWrapper}
        >
          <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={(text) => saveTaskObject(text)} />
          <TouchableOpacity onPress={() => handleAddTask()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
  
        </KeyboardAvoidingView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8EAED',
    },
    tasksWrapper: {
      paddingTop: 80,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    items: {
      marginTop: 30,
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
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      borderRadius: 60,
      borderColor: '#C0C0C0',
      borderWidth: 1,
      width: 250,
    },
    updateInput: {
      paddingVertical: 15,
      paddingHorizontal: 15,
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
    with: 100,
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
  addText: {
    fontSize: 36,
    lineHeight: 36,
  },
  });
export default ToDoList;