import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initClaudeClient, generateResume } from '../config/claude';

export default function ResumeFormScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    apiKey: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const client = initClaudeClient(formData.apiKey);
      const resume = await generateResume(client, formData);
      
      // Save the generated resume
      const savedResumes = await AsyncStorage.getItem('resumes') || '[]';
      const resumes = JSON.parse(savedResumes);
      resumes.push({
        id: Date.now().toString(),
        data: resume,
        createdAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem('resumes', JSON.stringify(resumes));
      
      navigation.navigate('ResumePreview', { resume });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate resume. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text h3 style={styles.title}>Enter Your Information</Text>
      
      <Input
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />
      
      <Input
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
      />
      
      <Input
        placeholder="Phone"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        keyboardType="phone-pad"
      />
      
      <Input
        placeholder="Professional Summary"
        value={formData.summary}
        onChangeText={(text) => setFormData({ ...formData, summary: text })}
        multiline
      />
      
      <Input
        placeholder="Work Experience"
        value={formData.experience}
        onChangeText={(text) => setFormData({ ...formData, experience: text })}
        multiline
      />
      
      <Input
        placeholder="Education"
        value={formData.education}
        onChangeText={(text) => setFormData({ ...formData, education: text })}
        multiline
      />
      
      <Input
        placeholder="Skills (comma separated)"
        value={formData.skills}
        onChangeText={(text) => setFormData({ ...formData, skills: text })}
      />
      
      <Input
        placeholder="Claude API Key"
        value={formData.apiKey}
        onChangeText={(text) => setFormData({ ...formData, apiKey: text })}
        secureTextEntry
      />
      
      <Button
        title={loading ? "Generating..." : "Generate Resume"}
        onPress={handleSubmit}
        disabled={loading}
        containerStyle={styles.buttonContainer}
        loading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  buttonContainer: {
    marginVertical: 20,
  },
}); 