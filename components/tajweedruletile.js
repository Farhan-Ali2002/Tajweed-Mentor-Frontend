import React from "react";
import { View,Text,TouchableOpacity,StyleSheet } from "react-native";

const LessonItem = ({ title, arabicTitle, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.listItem}>
        <Text style={styles.listItemText}>{title}</Text>
        {arabicTitle && <Text style={styles.listItemText}>{arabicTitle}</Text>}
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    listItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      padding: 15,
      backgroundColor: '#1e4682',
      marginBottom: 5,
      borderRadius: 8,
    },
    listItemText: {
      fontSize: 16,
      color:"white"
    },
  });

  export default LessonItem

