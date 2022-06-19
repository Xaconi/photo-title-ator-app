import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [type, setType] = useState(CameraType.back);

  useEffect(() => {
    (async () => {
      await getPermission();
    })();
  }, []);

  if (!hasPermission)
    return <Text>No access to camera</Text>;
  
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <View style={styles.flipButtonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back);
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity
              style={styles.captureButton}
              onPress={() => {
                console.log("CAPTURE");
              }}>
            </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );

  async function getPermission(): Promise<void> {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  flipButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  flipButton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  captureButtonContainer: {
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
  text: {
    fontSize: 18,
    color: 'white',
  },
});
