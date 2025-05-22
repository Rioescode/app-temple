import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Input, Button, Text, Icon, Divider } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initClaudeClient, generateResume } from '../config/claude';

export default function ResumeFormScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    workExperience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    education: [{
      school: '',
      degree: '',
      year: '',
      description: ''
    }],
    skills: [],
    apiKey: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.summary) newErrors.summary = 'Summary is required';
    if (!formData.apiKey) newErrors.apiKey = 'API Key is required';
    if (formData.workExperience.length === 0) newErrors.workExperience = 'Add at least one work experience';
    if (formData.education.length === 0) newErrors.education = 'Add at least one education entry';
    if (formData.skills.length === 0) newErrors.skills = 'Add at least one skill';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        { company: '', position: '', startDate: '', endDate: '', description: '' }
      ]
    });
  };

  const updateWorkExperience = (index, field, value) => {
    const newWorkExperience = [...formData.workExperience];
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    setFormData({ ...formData, workExperience: newWorkExperience });
  };

  const removeWorkExperience = (index) => {
    if (formData.workExperience.length > 1) {
      const newWorkExperience = formData.workExperience.filter((_, i) => i !== index);
      setFormData({ ...formData, workExperience: newWorkExperience });
    }
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { school: '', degree: '', year: '', description: '' }
      ]
    });
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData({ ...formData, education: newEducation });
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      const newEducation = formData.education.filter((_, i) => i !== index);
      setFormData({ ...formData, education: newEducation });
    }
  };

  const updateSkills = (text) => {
    const skillsArray = text.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData({ ...formData, skills: skillsArray });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields correctly');
      return;
    }

    try {
      setLoading(true);
      const client = initClaudeClient(formData.apiKey);
      const resume = await generateResume(client, formData);
      
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
      <Text h3 style={styles.title}>Create Your Resume</Text>
      
      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>Personal Information</Text>
        <Input
          placeholder="Full Name *"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          errorMessage={errors.fullName}
          leftIcon={<Icon name="person" type="material" color="#86939e" />}
        />
        
        <Input
          placeholder="Email *"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          errorMessage={errors.email}
          leftIcon={<Icon name="email" type="material" color="#86939e" />}
        />
        
        <Input
          placeholder="Phone *"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
          errorMessage={errors.phone}
          leftIcon={<Icon name="phone" type="material" color="#86939e" />}
        />
      </View>

      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>Professional Summary</Text>
        <Input
          placeholder="Write a brief summary of your professional background *"
          value={formData.summary}
          onChangeText={(text) => setFormData({ ...formData, summary: text })}
          multiline
          numberOfLines={4}
          errorMessage={errors.summary}
        />
      </View>

      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>Work Experience</Text>
        {formData.workExperience.map((exp, index) => (
          <View key={index} style={styles.experienceContainer}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>Experience {index + 1}</Text>
              {formData.workExperience.length > 1 && (
                <TouchableOpacity onPress={() => removeWorkExperience(index)}>
                  <Icon name="delete" type="material" color="#ff6b6b" />
                </TouchableOpacity>
              )}
            </View>
            <Input
              placeholder="Company Name *"
              value={exp.company}
              onChangeText={(text) => updateWorkExperience(index, 'company', text)}
            />
            <Input
              placeholder="Position *"
              value={exp.position}
              onChangeText={(text) => updateWorkExperience(index, 'position', text)}
            />
            <View style={styles.dateContainer}>
              <Input
                containerStyle={styles.dateInput}
                placeholder="Start Date *"
                value={exp.startDate}
                onChangeText={(text) => updateWorkExperience(index, 'startDate', text)}
              />
              <Input
                containerStyle={styles.dateInput}
                placeholder="End Date *"
                value={exp.endDate}
                onChangeText={(text) => updateWorkExperience(index, 'endDate', text)}
              />
            </View>
            <Input
              placeholder="Description *"
              value={exp.description}
              onChangeText={(text) => updateWorkExperience(index, 'description', text)}
              multiline
              numberOfLines={3}
            />
            <Divider style={styles.divider} />
          </View>
        ))}
        <Button
          title="Add Work Experience"
          onPress={addWorkExperience}
          type="outline"
          icon={<Icon name="add" type="material" color="#2089dc" />}
          containerStyle={styles.addButton}
        />
      </View>

      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>Education</Text>
        {formData.education.map((edu, index) => (
          <View key={index} style={styles.educationContainer}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>Education {index + 1}</Text>
              {formData.education.length > 1 && (
                <TouchableOpacity onPress={() => removeEducation(index)}>
                  <Icon name="delete" type="material" color="#ff6b6b" />
                </TouchableOpacity>
              )}
            </View>
            <Input
              placeholder="School/University *"
              value={edu.school}
              onChangeText={(text) => updateEducation(index, 'school', text)}
            />
            <Input
              placeholder="Degree/Certificate *"
              value={edu.degree}
              onChangeText={(text) => updateEducation(index, 'degree', text)}
            />
            <Input
              placeholder="Year *"
              value={edu.year}
              onChangeText={(text) => updateEducation(index, 'year', text)}
              keyboardType="numeric"
            />
            <Input
              placeholder="Description"
              value={edu.description}
              onChangeText={(text) => updateEducation(index, 'description', text)}
              multiline
            />
            <Divider style={styles.divider} />
          </View>
        ))}
        <Button
          title="Add Education"
          onPress={addEducation}
          type="outline"
          icon={<Icon name="add" type="material" color="#2089dc" />}
          containerStyle={styles.addButton}
        />
      </View>

      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>Skills</Text>
        <Input
          placeholder="Enter skills (comma separated) *"
          value={formData.skills.join(', ')}
          onChangeText={updateSkills}
          errorMessage={errors.skills}
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>API Configuration</Text>
        <Input
          placeholder="Claude API Key *"
          value={formData.apiKey}
          onChangeText={(text) => setFormData({ ...formData, apiKey: text })}
          secureTextEntry
          errorMessage={errors.apiKey}
          leftIcon={<Icon name="key" type="material" color="#86939e" />}
        />
      </View>
      
      <Button
        title={loading ? "Generating..." : "Generate Resume"}
        onPress={handleSubmit}
        disabled={loading}
        containerStyle={styles.submitButton}
        loading={loading}
        icon={loading ? null : <Icon name="description" type="material" color="white" style={styles.buttonIcon} />}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#2c3e50',
  },
  section: {
    marginBottom: 20,
    padding: 15,
  },
  sectionTitle: {
    color: '#2c3e50',
    marginBottom: 15,
  },
  experienceContainer: {
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#e0e0e0',
  },
  addButton: {
    marginTop: 10,
  },
  submitButton: {
    margin: 20,
    marginBottom: 40,
  },
  buttonIcon: {
    marginRight: 10,
  },
  educationContainer: {
    marginBottom: 15,
  },
}); 