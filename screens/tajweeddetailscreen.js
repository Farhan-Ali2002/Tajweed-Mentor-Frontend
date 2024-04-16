import React from 'react';
import { View, Text, StyleSheet, Image, Audio, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import surahikhlas from "../assets/surahikhlasimg.png"
const TajweedDetailsScreen = ({ route, navigation }) => {
  const { lesson } = route.params; // Get lesson data passed from LessonsScreen

  const playAudio = async (audioUrl) => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      await sound.playAsync();
    } catch (error) {
      console.error(error); // Handle audio playback error
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.audioExampleItem}
      onPress={() => playAudio(item.url)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.audioImage}
        resizeMode="contain"
      />
      <Text style={styles.audioTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground style={styles.container} source={require("../assets/background.jpg")}>
      <View style={styles.card}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.description}>{lesson.description}</Text>
      </View>
      <View style={styles.audioExamples}>
        <Text style={styles.audioText}>Audio Examples:</Text>
        <FlatList
          data={lesson.audioExamples}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2} // Two items per row
          columnWrapperStyle={styles.columnWrapper} // For equal spacing between columns
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#1e4681',
    padding: 17,
    borderRadius: 5,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: "white"
  },
  description: {
    fontSize: 18,
    color: 'white',
  },
  audioExamples: {
    marginBottom: 10,
  },
  audioExampleItem: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  audioImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  audioTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
  audioText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default TajweedDetailsScreen;
