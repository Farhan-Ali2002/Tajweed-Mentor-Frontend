import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { Audio } from 'expo-av';

const FeedbackScreen = ({ route }) => {
  const { predictedLabels, audioUrl } = route.params;
  const overallAccuracy = 0.8;

  const segments_dict = predictedLabels["segments_dict"];
  const label_list = [
    "no_rule_0", "heavy_1", "qalqala_2", "no_rule_3", "laam_shimsiya_4", "no_rule_5", "qalqala_6",
    "qalqala_7", "no_rule_8", "idgham_9", "izhaar-e-halka(tanween hamza)_10", "qalqala_11", "no_rule_12","izhaar-e-halka(tanween hamza)_13","qalqala_14"
  ];

  // Function to play the recorded audio
  const playAudio = async (start, end) => {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    await sound.playFromPositionAsync(start * 1000);
    setTimeout(() => {
      sound.stopAsync();
    }, (end - start) * 1000);
  };

  const renderRuleRow = (rule, index) => {
    if (rule.includes('no_rule')) {
      return null;
    }

    const isRuleViolated = segments_dict.hasOwnProperty(rule);
    const icon = isRuleViolated ? "times" : "check";
    const iconColor = isRuleViolated ? "red" : "green";
    const start = isRuleViolated ? segments_dict[rule][0][0] : null;
    const end = isRuleViolated ? segments_dict[rule][0][1] : null;

    return (
      <View style={styles.ruleRow} key={index}>
        <View style={styles.ruleNameContainer}>
          <Text style={styles.ruleText}>{rule.replace(/_/g, ' ')}:</Text>
          <FontAwesome name={icon} size={24} color={iconColor} />
        </View>
        {isRuleViolated && (
          <FontAwesome.Button
            name="play"
            backgroundColor="darkblue"
            onPress={() => playAudio(start, end)}
            style={styles.playButton}
          >
            Play
          </FontAwesome.Button>
        )}
      </View>
    );
  };

  return (
    <ImageBackground style={styles.container} source={require("../assets/background.jpg")}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card containerStyle={styles.cardContainer}>
          <Text style={styles.cardTitle}>Feedback</Text>
          <View style={styles.ruleContainer}>
            {label_list
              .filter(rule => !rule.includes('no_rule')) // Filter out keys containing 'no_rule'
              .map(renderRuleRow)}
          </View>
          <Text style={{ color: "white", marginBottom: 3 }}>Overall Accuracy</Text>
          <Progress.Bar progress={overallAccuracy} width={200} />
          <Text style={{ color: "white", marginTop: 3 }}>{(overallAccuracy * 100).toFixed(2)}%</Text>
        </Card>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '90%',
    backgroundColor: "#1e4681",
    borderRadius: 20,
    padding: 20,
    paddingTop: 30,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "white",
  },
  ruleContainer: {
    marginTop: 10,
  },
  ruleRow: {
    marginBottom: 20,
  },
  ruleNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ruleText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    flex: 1,
  },
  playButton: {
    width: 100, // Adjust the width of the play button
  },
});

export default FeedbackScreen;
