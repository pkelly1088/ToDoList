import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const Task = (props) => {

    const completeTask = (props) => {
        let itemsCopy = [...taskItems];
        itemsCopy.splice(props.key, 1);
        setTaskItems(itemsCopy);
      }

    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <View style={styles.square}></View>
                <Text style={styles.itemText}>{props.text}</Text>

            </View>
            <TouchableOpacity key={props.key} onPress={() => completeTask(props.key)}>
                <View style={styles.circular}></View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
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
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#55BCF6',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
    },
    itemText: {
        maxWidth: '80%',
    },
    circular: {
        width: 12,
        height: 12,
        borderColor: '#55BDF6',
        borderWidth: 2,
        borderRadius: 5,
    },
});

export default Task;