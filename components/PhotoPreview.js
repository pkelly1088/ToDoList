import React, { useState, useEffect} from 'react';
import { Text, View, Pressable, StyleSheet, ImageBackground, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as SQLite from 'expo-sqlite';
import { AutoFocus } from 'expo-camera/build/Camera.types';

const PhotoPreview = ({ route }) => {

    let myPhoto = route.params.photo;
    let startingLocation = route.params.startingLocation;

    const navigation = useNavigation();

    return(
        <View style={styles.container}>
            <ImageBackground source={{uri: myPhoto && myPhoto.uri}} style={styles.photoView}/>
            <View style={styles.photoButtons}>
                <Pressable style={styles.photoButton} onPress={() => navigation.navigate('My Camera', {
                    startingLocation: startingLocation,
                })}>
                    <Text style={styles.photoBtnText}>Retake</Text>
                </Pressable>
                <Pressable style={styles.photoButton} onPress={() => navigation.navigate(`${startingLocation}`, {
                    newPhoto: myPhoto,
                })}>
                    <Text style={styles.photoBtnText}>Save</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
    },
    photoView: {
        flex: 1,
    },
    photoButtons: {
        position: 'absolute',
        bottom: 10,
        paddingRight: 30,
        paddingLeft: 30,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    photoButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'transparent',
        marginHorizontal: 20,
        marginBottom: 40,
      },
      photoBtnText: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center', 
      },
})

export default PhotoPreview;