import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import LessonItem from '../components/tajweedruletile';
import { lessonsData } from '../data/lessonData';


const HomeScreen = ({navigation}) => {
    const handleLessonPress = (lessonId) => {
        const selectedLesson = lessonsData.find((lesson) => lesson.id === lessonId);
        navigation.navigate('TajweedDetails', { lesson: selectedLesson });
      };

  return (
    
    <ImageBackground style={styles.container} source={require("../assets/background.jpg")}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Tajweed Lessons</Text>
      </View> */}
      <View style={styles.content}>
        {lessonsData.map((lesson) => (
          <LessonItem
            key={lesson.id}
            title={lesson.title}
            arabicTitle={lesson.arabicTitle}
            onPress={() => handleLessonPress(lesson.id)}
          />
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
  },
  
});

export default HomeScreen;
