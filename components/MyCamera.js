import React, { useState, useEffect} from 'react';
import { Text, View, Pressable, StyleSheet, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';

const MyCamera = ({route}) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    const navigation = useNavigation();

    let startingLocation = route.params.startingLocation;

    let camera = Camera;

    const captureHandle = async () => {
        try {
            if(camera){
                const photo = await camera.takePictureAsync();
                setPreviewVisible(true);
                setCapturedImage(photo);
                navigation.navigate('Photo Preview', {
                    photo: photo,
                    startingLocation: startingLocation,
                })
            }
            
        } catch (error) {
            console.log(error);   
        }
    }

    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);
    
      if (hasPermission === null) {
        return <View />;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }

    return(
        <View style={styles.body}>
            <Camera type={Camera.Constants.Type.back} style={styles.preview} ref={ref => {
                camera = ref;
            }}>
            <Pressable style={styles.cameraButton} onPress={() => captureHandle()}>
                    <Text style={styles.cameraBtnText}>Take Picture</Text>
            </Pressable>

            </Camera>
        </View>
    )
}

const styles = StyleSheet.create({
    body:{
        flex: 1,
    },
    preview: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    cameraButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#57B9E2',
        marginHorizontal: 20,
        marginBottom: 40,
      },
      cameraBtnText: {
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
})

export default MyCamera;