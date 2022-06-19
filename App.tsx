import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera, CameraCapturedPicture, CameraProps, CameraType } from 'expo-camera';
import { saveToLibraryAsync } from 'expo-media-library';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [hasTakenPicture, setHasTakenPicture] = useState<boolean>(false);
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const [type, setType] = useState(CameraType.back);

  // Camera data
  let camera: Camera;

  useEffect(() => {
    (async () => {
      await getPermission();
    })();
  }, []);

  if (!hasPermission)
    return <Text>No access to camera</Text>;
  
  if(hasTakenPicture && picture)
    return(
      <View style={styles.container}>
        <Image style={styles.image} source={ { uri: picture.uri }}></Image>
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
      <Camera style={styles.camera} type={type} ref={(ref: Camera) => camera = ref}>
        <View style={styles.flipButtonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back);
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
      </Camera>
    </View>
  );

  async function getPermission(): Promise<void> {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  async function takePicture(): Promise<void> {
    setHasTakenPicture(true);
    const capturedPicture: CameraCapturedPicture = await camera.takePictureAsync();
    setPicture(capturedPicture);
  }

  async function savePicture(picture: CameraCapturedPicture): Promise<void> {
    const savedImage = await saveToLibraryAsync(picture?.uri);
    setHasTakenPicture(false);
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
