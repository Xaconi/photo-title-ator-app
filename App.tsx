// Core
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, PermissionsAndroid, Platform } from 'react-native';

// Libs
import { 
  Camera, 
  CameraPermissionRequestResult,
  useCameraDevices 
} from 'react-native-vision-camera';
import ImageMarker, { TextBackgroundType } from "react-native-image-marker";
import CameraRoll from "@react-native-community/cameraroll";


export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [hasTakenPicture, setHasTakenPicture] = useState<boolean>(false);
  const [type, setType] = useState<'front' | 'back'>('back');
  const [picture, setPicture] = useState<string>();

  const devices = useCameraDevices()
  let device = devices[type];
  const camera = useRef<Camera>(null)

  useEffect(() => {
    (async () => {
      await getPermission();
    })();
  }, []);

  useEffect(() => {
    device = devices[type];
  }, [type]);

  if (!hasPermission)
    return <Text>No access to camera</Text>;

  if (!device)
    return <Text>No device available</Text>;
  
  if(hasTakenPicture && picture)
    return(
      <View style={styles.container}>
        <Image style={styles.image} source={ { uri: picture }}></Image>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => setHasTakenPicture(false) }>
            <Text style={styles.text}> Back </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerAbsoluteContainer}>
          <TouchableOpacity
              style={styles.saveButton}
              onPress={() => savePicture(picture)}>
                <Text style={styles.text}> Save </Text>
            </TouchableOpacity>
        </View>
      </View>
    )

  return (
    <View style={styles.container}>
      <Camera 
        style={StyleSheet.absoluteFill}
        device={device!} 
        isActive={true}
        photo={true}
        ref={camera}
      />
      <View style={styles.flipButtonContainer}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => {
            setType(type === 'back' ? 'front' : 'back');
          }}>
          <Text style={styles.text}> Flip </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.centerAbsoluteContainer}>
        <TouchableOpacity
            style={styles.captureButton}
            onPress={() => takePicture()}>
          </TouchableOpacity>
      </View>
    </View>
  );

  async function getPermission(): Promise<void> {
    const currentStatus: CameraPermissionRequestResult = await Camera.requestCameraPermission();
    setHasPermission(currentStatus === 'authorized');
    setType('back');
  }

  async function takePicture(): Promise<void> {
    try {
      if (camera.current == null) throw new Error('Camera Ref is Null');
      console.log('Photo taking ....');
      const photo = await camera.current.takePhoto();
      console.log(photo);
      setHasTakenPicture(true);
      setPicture(`file://${photo.path}`);
    }
    catch(error: any) {
      console.error(error);
    }
  }

  async function savePicture(picture: string): Promise<void> {
    const newImageUri: string = await ImageMarker.markText({
      src: picture,
      text: 'text marker', 
      X: 150,
      Y: 150, 
      color: '#FF0000',
      fontName: 'Arial-BoldItalicMT',
      fontSize: 44,
      scale: 1, 
      quality: 100
    });
   
    if (Platform.OS === "android" && !(await hasAndroidPermission()))
      return;

    CameraRoll.save(newImageUri);
    setHasTakenPicture(false);
  }

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  backButtonContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 20,
    left: 20
  },
  flipButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  backButton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  flipButton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  centerAbsoluteContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30
  },
  captureButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: '#fff'
  },
  saveButton: {
    flex: 1
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
