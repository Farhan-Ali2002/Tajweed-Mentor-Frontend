import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Card } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
// import ProgressBar from 'react-native-progress-bar/ProgressBar';
import * as Progress from 'react-native-progress';

const FeedbackScreen = () => {
    const overallAccuracy = 0.8; 
  return (
    <ImageBackground style={styles.container} source={require("../assets/background.jpg")}>
      <Card containerStyle={styles.cardContainer}>
        <Text style={styles.cardTitle}>Feedback</Text>
        <View style={styles.ruleContainer}>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleText}>Qalqalah:</Text>
            <FontAwesome
              name="check"
              size={24}
              color="green"
            />
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleText}>Idghaam without ghunnah:</Text>
            <FontAwesome
              name="times"
              size={24}
              color="red"
            />
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleText}>Laam Shimsiya</Text>
            <FontAwesome
              name="times"
              size={24}
              color="red"
            />
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleText}>Izhare Halqi</Text>
            <FontAwesome
              name="times"
              size={24}
              color="red"
            />
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleText}>Wow Madd:</Text>
            <FontAwesome
              name="check"
              size={24}
              color="green"
            />
          </View>
          {/* Add more rule rows as needed */}
        </View>
        {/* <ProgressBar progress={overallAccuracy} style={styles.progressBar} color="#3CB371" /> */}
        <Text style={{color:"white", marginBottom:3}} h5>Overall Accuracy</Text>
        <Progress.Bar progress={0.3} width={200} /> 
        <Text style={{color:"white", marginTop:3}}>30%</Text>
      </Card>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // Background color for the screen
  },
  cardContainer: {
    width: '90%',
    backgroundColor: "#1e4681",
    borderRadius: 20, // Rounded corners for the card
    padding: 20,
    paddingTop: 30, // Extra padding for the title
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "white"
  },
  ruleContainer: {
    marginTop: 10,
    
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: "space-between"
  },
  ruleText: {
    fontSize: 18,
    marginRight: 10,
    color: "white",
    fontWeight: "bold"
  },
});

export default FeedbackScreen;
