import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Button } from 'react-native';
import { Card } from 'react-native-elements';
import { Audio } from 'expo-av';

const PlayBackScreen = ({ route }) => {
  const { predictedLabels, audioUrl } = route.params;
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(sound);
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUrl]);

  const playAudioAtTimestamp = async (timestamp) => {
    if (sound) {
      await sound.setPositionAsync(timestamp);
      await sound.playAsync();
    }
  };

  return (
    <ImageBackground style={styles.container} source={require("../assets/background.jpg")}>
      <Card containerStyle={styles.cardContainer}>
        <Card.FeaturedSubtitle style={{ color: 'white', fontSize: 16, marginTop: 10 }}>
          Predicted Labels:
        </Card.FeaturedSubtitle>
        <Text style={styles.labelText}>
          {JSON.stringify(predictedLabels, null, 2)}
        </Text>
        {predictedLabels.timestamps && predictedLabels.timestamps.map((timestamp, index) => (
          <Button
            key={index}
            title={`Play at ${timestamp}`}
            onPress={() => playAudioAtTimestamp(timestamp)}
          />
        ))}
      </Card>
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
  labelText: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
  },
});

export default PlayBackScreen;
