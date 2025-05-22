import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@rneui/themed';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>Resume Builder</Text>
      <Text style={styles.subtitle}>Create professional resumes with AI</Text>
      <Button
        title="Create New Resume"
        onPress={() => navigation.navigate('ResumeForm')}
        containerStyle={styles.buttonContainer}
        raised
      />
      <Button
        title="View Saved Resumes"
        onPress={() => navigation.navigate('SavedResumes')}
        containerStyle={styles.buttonContainer}
        type="outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: 10,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
}); 