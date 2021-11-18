import React, { useState, useEffect} from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, Keyboard, Alert, ImageBackground, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startMode, setStartMode] = useState('date');
  const [endMode, setEndMode] = useState('date');
  const [startShow, setStartShow] = useState(false);
  const [endShow, setEndShow] = useState(false);

  const navigation = useNavigation();

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartShow(Platform.OS === 'ios');
    setStartDate(currentDate);
    console.log('start date:',currentDate);
  };

  const showStartMode = (currentMode) => {
    setStartShow(true);
    setStartMode(currentMode);
  };

  const showStartDatepicker = () => {
    showStartMode('date');
  };

  const showStartTimepicker = () => {
    showStartMode('time');
  };

  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndShow(Platform.OS === 'ios');
    setEndDate(currentDate);
    console.log('end date:',currentDate);
  };

  const showEndMode = (currentMode) => {
    setEndShow(true);
    setEndMode(currentMode);
  };

  const showEndDatepicker = () => {
    showEndMode('date');
  };

  const showEndTimepicker = () => {
    showEndMode('time');
  };

  const addEventToCalendar = async() => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync();
        let myCalendars = calendars;
        if(myCalendars[0] === undefined){
          createCalendar();
        } else if(myCalendars[0].id === '1'){
          if(task === ''){
            Alert.alert('Please enter a task to add it to the calendar');
          } else {
            createCalendarEvent(myCalendars[0].id);
          }
        }
      }
  }

  const getDefaultCalendarSource = async() => {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }

  const createCalendar = async() => {
    const defaultCalendarSource =
      Platform.OS === 'ios'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };
    const newCalendarID = await Calendar.createCalendarAsync({
      title: 'Expo Calendar',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'internalCalendarName',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    console.log(`Your new calendar ID is: ${newCalendarID}`);
  }

  const createCalendarEvent = async(id) => {
    Calendar.createEventAsync(id, {
      title: task,
      startDate: startDate,
      endDate: endDate,
      timeZone: 'Eastern Standard Time'
    })
    .then((res) => {
      console.log('id number', res);
    })
    .then(() => {
      alert(`Success! Your task of ${task} was added to the calendar, from ${moment.utc(startDate).local().format('lll')} to ${moment.utc(endDate).local().format('lll')}`)
    })
    .catch((err) => {
      console.log(err);
    })
  }

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

const pickFromCamera = async () => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
    } else {
      let result = await ImagePicker.launchCameraAsync({
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
    <ScrollView style={styles.container}>
        <View style={styles.addWrapper}>
            <Text style={styles.addTitle}>Add A Task</Text>
            <View style={styles.addItemSection}>
                <Text style={styles.addText}>Task:</Text>
                <TextInput style={styles.input} value={task} placeholder={'Enter Task Here'} onChangeText={(text) => setTask(text)}/>
                <Text style={styles.addText}>Photo:</Text>
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
                <View style={styles.btnContainer}>
                  <Pressable style={styles.addCameraButton} onPress={() => pickFromCamera()}>
                    <Text style={styles.addBtnText}>Camera</Text>
                  </Pressable>
                  <Pressable style={styles.addCameraButton} onPress={() => pickFromGallery()}>
                    <Text style={styles.addBtnText}>Gallery</Text>
                  </Pressable>
                </View>
                <View style={styles.eventContainer}>
                  <Text style={styles.addText}>Start Date: {moment.utc(startDate).local().format('lll')}</Text>
                  <View style={styles.btnContainer}>
                    <Pressable style={styles.addCameraButton} onPress={() => showStartDatepicker()}>
                      <Text style={styles.addBtnText}>Date Picker</Text>
                    </Pressable>
                    <Pressable style={styles.addCameraButton} onPress={() => showStartTimepicker()}>
                      <Text style={styles.addBtnText}>Time Picker</Text>
                    </Pressable>
                    {startShow && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={startDate}
                        mode={startMode}
                        is24Hour={true}
                        display="default"
                        onChange={onStartChange}
                      />
                    )}
                  </View>
                  <Text style={styles.addText}>End Date: {moment.utc(endDate).local().format('lll')}</Text>
                  <View style={styles.btnContainer}>
                    <Pressable style={styles.addCameraButton} onPress={() => showEndDatepicker()}>
                      <Text style={styles.addBtnText}>Date Picker</Text>
                    </Pressable>
                    <Pressable style={styles.addCameraButton} onPress={() => showEndTimepicker()}>
                      <Text style={styles.addBtnText}>Time Picker</Text>
                    </Pressable>
                    {endShow && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={endDate}
                        mode={endMode}
                        is24Hour={true}
                        display="default"
                        onChange={onEndChange}
                      />
                    )}
                  </View>
                  <View style={styles.calendarBtnContainer}>
                    <Pressable style={styles.addCameraButton} onPress={() => addEventToCalendar()}>
                      <Text style={styles.addBtnText}>Add to Calendar</Text>
                    </Pressable>
                  </View>
                </View>
                <Pressable style={styles.submitButton} onPress={() => handleAddTask()}>
                    <Text style={styles.addBtnText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    </ScrollView>
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
        borderRadius: 4,
        borderColor: '#C0C0C0',
        borderWidth: 1,
        marginBottom: 32,
    },
    addButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: '#57B9E2',
      marginTop: 20,
    },
    addCameraButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: '#ffffff',
      borderColor: '#57B9E2',
      borderStyle: 'solid',
      borderWidth: 2,
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
    submitButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: '#57B9E2',
      marginVertical: 36,
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
      marginBottom: 16,
    },
    photoSquare: {
      height: 300,
      width: 300,
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
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    eventContainer: {
      paddingTop: 24,
      paddingHorizontal: 20,
    },
    calendarBtnContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 16,
    },
});

export default addTask;