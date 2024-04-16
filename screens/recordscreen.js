import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import * as FileSystem from 'expo-file-system'; // Import FileSystem module
import { Card, Button, } from 'react-native-elements';
import { color } from 'react-native-elements/dist/helpers';
import { BlobServiceClient } from '@azure/storage-blob';

const blobServiceClient = BlobServiceClient.fromConnectionString('<your_connection_string>');
const containerName = '<your_container_name>';

export default function RecordScreen() {
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);

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
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
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

  async function stopRecording() {
    setIsRecording(false);
    clearInterval(intervalRef.current); // Stop the duration timer
  
    if (recording) {
      await recording.stopAndUnloadAsync();
      let allRecordings = [...recordings];
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const fileURI = recording.getURI();
  
      // Upload WAV file to Azure Blob Storage
      const blobName = `${Date.now()}.wav`;
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
      try {
        await blockBlobClient.uploadFile(fileURI);
        console.log('File uploaded to Azure Blob Storage:', blobName);
  
        allRecordings.push({
          sound: sound,
          duration: getDurationFormatted(status.durationMillis),
          file: `https://${containerClient.accountName}.blob.core.windows.net/${containerName}/${blobName}`,
        });
      } catch (error) {
        console.error('Error uploading file to Azure Blob Storage:', error);
        // Handle upload error
      }
  
      setRecordings(allRecordings);
      setRecording(null);
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
        style={{width:120, height: 40}}
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
        <Card.Divider/>
        <Card.FeaturedSubtitle style={{color: 'white', fontSize:16, marginTop:10}}>
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
    marginLeft:10
  },
  duration: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"white"
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
});
