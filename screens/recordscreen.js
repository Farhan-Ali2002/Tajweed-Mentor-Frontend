import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import * as FileSystem from 'expo-file-system'; // Import FileSystem module
import { Card, Button, } from 'react-native-elements';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import firebase from '../helper/firebase';

export default function RecordScreen() {
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);
  const [predictedLabels, setPredictedLabels] = useState({});
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Uncomment and update the following lines if you need to load a model
    // const loadModel = async () => {
    //   const modelPath = './assets/tajweed_model/tajweed_analyzer_model.tflite';
    //   const modelFile = await Fetch(modelPath);
    //   const model = await tf.loadTFLiteModel(modelFile);
    //   setModel(model);  
    // };

    // loadModel();
  }, []);

  const navigateToFeedback = (labels, audioUrl) => {
    navigation.navigate('Feedback', {
      predictedLabels: labels,
      audioUrl: audioUrl,
    });
  };

  async function startRecording() {
    if (recordings.length === 0) {
      try {
        const perm = await Audio.requestPermissionsAsync();
        if (perm.status === 'granted') {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
          const { recording } = await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
          );
          setRecording(recording);
          setIsRecording(true);
          setDuration(0); // Reset duration when starting a new recording
          intervalRef.current = setInterval(() => {
            setDuration((prevDuration) => prevDuration + 0.1);
          }, 100); // Update duration every 100 milliseconds
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function uploadFileToFirebase(uri, fileName) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();

    const fileRef = ref(storage, `audios/${fileName}`);

    try {
      await uploadBytes(fileRef, blob, 'blob');
      console.log('Uploaded to firebase storage!');

      // Get download URL
      const downloadURL = await getDownloadURL(fileRef);
      console.log('Download URL:', downloadURL);

      return downloadURL; // Return the download URL
    } catch (error) {
      console.error('Error uploading file:', error);
      return null; // Return null if there's an error
    }
  }

  async function getMfccFeatures(downloadURL) {
    const apiUrl = 'http://192.168.0.116:5000/predict_labels';
    setLoading(true); // Show loading spinner

    try {
      const response = await axios.post(apiUrl, {
        audio_file_url: downloadURL
      });
      setPredictedLabels(response.data);
      console.log('API response 0 :', response.data);
      console.log('API response:', predictedLabels);
      navigateToFeedback(response.data, downloadURL);
    } catch (error) {
      if (error.response) {
        console.error('API error data:', error.response.data);
        console.error('API error status:', error.response.status);
        console.error('API error headers:', error.response.headers);
      } else if (error.request) {
        console.error('API request:', error.request);
      } else {
        console.error('API error:', error.message);
      }
    } finally {
      setLoading(false); // Hide loading spinner
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    clearInterval(intervalRef.current); // Stop the duration timer

    if (recording) {
      await recording.stopAndUnloadAsync();
      let allRecordings = [...recordings];
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      allRecordings.push({
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      });

      setRecordings(allRecordings);
      setRecording(null);

      const fileInfo = await FileSystem.getInfoAsync(recording.getURI());
      const fileName = `${Date.now()}.${fileInfo.uri.split('.').pop()}`; // Get the original file extension
      const downloadURL = await uploadFileToFirebase(recording.getURI(), fileName);

      if (downloadURL) {
        console.log('Uploaded audio URL:', downloadURL);
        getMfccFeatures(downloadURL);
      }
    }
  }

  function getDurationFormatted(milliseconds) {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => (
      <View key={index} style={styles.row}>
        <FontAwesome.Button
          style={{ width: 120, height: 40 }}
          name="play"
          backgroundColor="darkblue"
          onPress={() => recordingLine.sound.replayAsync()}
        >
          {" Play"}
        </FontAwesome.Button>
        {recordings.length > 0 && (
          <Button
            title="Clear Recording"
            onPress={clearRecordings}
            buttonStyle={styles.clearButton}
            titleStyle={{ color: 'white' }}
          />
        )}
      </View>
    ));
  }

  function clearRecordings() {
    setRecordings([]);
  }

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current); // Cleanup function to stop timer on unmount
    };
  }, []);

  return (
    <ImageBackground style={styles.container} source={require("../assets/background.jpg")}>
      <Card containerStyle={styles.cardContainer}>
        <Card.Image
          resizeMode='cover'
          source={require('../assets/surahikhlasimg.png')}
          style={styles.image}
        />
        <Card.Divider />
        <Card.FeaturedSubtitle style={{ color: 'white', fontSize: 16, marginTop: 10 }}>
          Say, "He is Allah, [who is] One,
          Allah, the Eternal Refuge.
          He neither begets nor is born,
          Nor is there to Him any equivalent."
          (Quran 112:1-4)
        </Card.FeaturedSubtitle>
      </Card>

      <Button
        title={isRecording ? ' Stop Recording' : ' Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
        icon={
          <FontAwesome
            name={isRecording ? 'stop' : 'microphone'}
            size={20}
            color="white"
          />
        }
        buttonStyle={styles.recordButton}
      />
      {isRecording && (
        <Text style={styles.duration}>
          {getDurationFormatted(duration * 1000)}
        </Text>
      )}
      {loading && (
        <ActivityIndicator size="large" color="black" style={styles.spinner} />
      )}
      {getRecordingLines()}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#192841', // Dark blue background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: '#1e4681',
    height: '50%',
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5, // Android shadow
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    overflow: 'hidden', // Ensure content inside the card doesn't overflow
  },
  image: {
    width: '100%',
    // aspectRatio: 3 / 2,
    borderRadius: 10,
  },
  recordButton: {
    backgroundColor: '#007bff',
    marginVertical: 20,
  },
  clearButton: {
    backgroundColor: '#dc3545',
    marginVertical: 10,
    marginLeft: 10
  },
  duration: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "white"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  fill: {
    flex: 1,
    marginHorizontal: 15,
  },
  spinner: {
    marginTop: 20,
  },
});
