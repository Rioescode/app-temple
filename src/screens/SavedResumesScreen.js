import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { ListItem, Button, Text } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SavedResumesScreen({ navigation }) {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const savedResumes = await AsyncStorage.getItem('resumes');
      if (savedResumes) {
        setResumes(JSON.parse(savedResumes));
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
      Alert.alert('Error', 'Failed to load saved resumes');
    }
  };

  const deleteResume = async (id) => {
    try {
      const updatedResumes = resumes.filter(resume => resume.id !== id);
      await AsyncStorage.setItem('resumes', JSON.stringify(updatedResumes));
      setResumes(updatedResumes);
    } catch (error) {
      console.error('Error deleting resume:', error);
      Alert.alert('Error', 'Failed to delete resume');
    }
  };

  const renderItem = ({ item }) => (
    <ListItem.Swipeable
      bottomDivider
      onPress={() => navigation.navigate('ResumePreview', { resume: item.data })}
      rightContent={(reset) => (
        <Button
          title="Delete"
          onPress={() => {
            deleteResume(item.id);
            reset();
          }}
          icon={{ name: 'delete', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
        />
      )}
    >
      <ListItem.Content>
        <ListItem.Title>{item.data.personalInfo.fullName}</ListItem.Title>
        <ListItem.Subtitle>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem.Swipeable>
  );

  return (
    <View style={styles.container}>
      {resumes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text h4 style={styles.emptyText}>No saved resumes</Text>
          <Button
            title="Create New Resume"
            onPress={() => navigation.navigate('ResumeForm')}
            containerStyle={styles.buttonContainer}
          />
        </View>
      ) : (
        <FlatList
          data={resumes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginBottom: 20,
    color: '#7f8c8d',
  },
  buttonContainer: {
    width: '80%',
  },
}); 