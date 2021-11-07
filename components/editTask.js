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

const editTask = ({route}) => {


    useEffect(() => {
        console.log("Focused: ", isFocused);
        getData();
        saveIndex();
        savePhoto();
  }, [isFocused]);

  const saveIndex = () => {
      if(route.params.index){
        setTaskIndex (route.params.index);
        console.log(route.params.index);
      }
  }

  const savePhoto = () => {
    console.log("Focused: ", isFocused);
    try {
      if(route.params.newPhoto !== undefined){
        setPhoto(route.params.newPhoto);
      } else if(route.params.photo !== undefined){
        setPhoto(route.params.photo);
        console.log(route.params.photo);
      } else {
        setPhoto(null);
      }
    } catch (error) {
      console.log(error);  
    }
  }

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
                        photo: JSON.parse(results.rows.item(i).photo),
                        complete: intToBoolean(results.rows.item(i).complete),
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
  const [taskObject, setTaskObject] = useState({
    id: null,
    task: '',
    photo: null,
    complete: false,
  })
  const [taskItems, setTaskItems] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [taskIndex, setTaskIndex] = useState(null);

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
    let myTask = taskItems[taskIndex];
    myTask.task = text;
    let itemsCopy = [...taskItems];
    itemsCopy.splice(taskIndex, 1, myTask);
    setTaskItems(itemsCopy);
  }
    
  const handleUpdateTask = () => {
    Keyboard.dismiss();
    let myTask = taskItems[taskIndex];
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE toDoList SET task=?, photo=? WHERE ID=?`,
        [myTask.task, JSON.stringify(photo), myTask.id],
        () => {Alert.alert('Success', `Task updated to ${myTask.task}`) },
        error => {console.log('Error!', error)}
      )
    })
    let itemsCopy = [...taskItems];
    itemsCopy.splice(taskIndex, 1, myTask);
    setTaskItems(itemsCopy);
    navigation.goBack();
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

    return(
    <View style={styles.container}>
        <View style={styles.addWrapper}>
            <Text style={styles.addTitle}>Edit Task</Text>
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
                <TextInput style={styles.input} defaultValue={route.params.task} placeholder={'Enter Task Here'} onChangeText={(text) => updateTaskObject(text)}/>
                <View style={styles.btnContainer}>
                  <Pressable style={styles.editButton} onPress={() => navigation.navigate('My Camera', {
                    startingLocation: 'Edit Task',
                  })}>
                    <Text style={styles.editBtnText}>Take A Picture</Text>
                  </Pressable>
                  <Pressable style={styles.editButton} onPress={() => pickFromGallery()}>
                    <Text style={styles.editBtnText}>Pick From Gallery</Text>
                  </Pressable>
                </View>
                <Pressable style={styles.editButton} onPress={() => handleUpdateTask()}>
                    <Text style={styles.editBtnText}>Submit</Text>
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
    editButton: {
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
      editBtnText: {
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
      },
});

export default editTask;