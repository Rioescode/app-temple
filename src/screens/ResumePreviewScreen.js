import React from 'react';
import { ScrollView, StyleSheet, Share } from 'react-native';
import { Text, Card, Button } from '@rneui/themed';

export default function ResumePreviewScreen({ route, navigation }) {
  const { resume } = route.params;

  const shareResume = async () => {
    try {
      await Share.share({
        message: JSON.stringify(resume, null, 2),
        title: 'My Resume',
      });
    } catch (error) {
      console.error('Error sharing resume:', error);
    }
  };

  const renderSection = (title, content) => (
    <Card containerStyle={styles.section}>
      <Card.Title>{title}</Card.Title>
      <Card.Divider />
      {typeof content === 'string' ? (
        <Text>{content}</Text>
      ) : Array.isArray(content) ? (
        content.map((item, index) => (
          <Text key={index} style={styles.listItem}>• {item}</Text>
        ))
      ) : (
        Object.entries(content).map(([key, value], index) => (
          <Text key={index}>{key}: {value}</Text>
        ))
      )}
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.headerCard}>
        <Text h3 style={styles.name}>{resume.personalInfo.fullName}</Text>
        <Text style={styles.contact}>{resume.personalInfo.email}</Text>
        <Text style={styles.contact}>{resume.personalInfo.phone}</Text>
      </Card>

      {renderSection('Professional Summary', resume.summary)}
      {renderSection('Work Experience', resume.experience)}
      {renderSection('Education', resume.education)}
      {renderSection('Skills', resume.skills)}

      <Button
        title="Share Resume"
        onPress={shareResume}
        containerStyle={styles.buttonContainer}
        raised
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    backgroundColor: '#2c3e50',
    borderWidth: 0,
    padding: 20,
    margin: 0,
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  contact: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  section: {
    marginBottom: 10,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItem: {
    marginBottom: 5,
  },
  buttonContainer: {
    margin: 20,
  },
}); 