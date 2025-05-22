import React from 'react';
import { ScrollView, StyleSheet, Share, View, Platform } from 'react-native';
import { Text, Card, Button, Icon, Chip } from '@rneui/themed';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ResumePreviewScreen({ route, navigation }) {
  const { resume } = route.params;

  const generateHTML = () => {
    const skillsHTML = resume.skills.map(skill => 
      `<span class="skill">${skill}</span>`
    ).join(' ');

    const experienceHTML = resume.workExperience.map(exp => `
      <div class="experience-item">
        <h3>${exp.position} at ${exp.company}</h3>
        <p class="date">${exp.startDate} - ${exp.endDate}</p>
        <p>${exp.description}</p>
      </div>
    `).join('');

    const educationHTML = resume.education.map(edu => `
      <div class="education-item">
        <h3>${edu.degree}</h3>
        <h4>${edu.school} - ${edu.year}</h4>
        <p>${edu.description}</p>
      </div>
    `).join('');

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica', sans-serif;
              margin: 0;
              padding: 20px;
              color: #2c3e50;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #3498db;
              padding-bottom: 20px;
            }
            .name {
              font-size: 28px;
              margin: 0;
              color: #2c3e50;
            }
            .contact {
              margin: 10px 0;
              color: #7f8c8d;
            }
            .section {
              margin: 20px 0;
            }
            .section-title {
              color: #3498db;
              border-bottom: 1px solid #bdc3c7;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .experience-item, .education-item {
              margin-bottom: 15px;
            }
            .date {
              color: #7f8c8d;
              font-style: italic;
              margin: 5px 0;
            }
            .skill {
              display: inline-block;
              background: #3498db;
              color: white;
              padding: 5px 10px;
              border-radius: 15px;
              margin: 5px;
              font-size: 14px;
            }
            p {
              margin: 5px 0;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="name">${resume.personalInfo.fullName}</h1>
            <div class="contact">
              ${resume.personalInfo.email} | ${resume.personalInfo.phone}
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p>${resume.summary}</p>
          </div>

          <div class="section">
            <h2 class="section-title">Work Experience</h2>
            ${experienceHTML}
          </div>

          <div class="section">
            <h2 class="section-title">Education</h2>
            ${educationHTML}
          </div>

          <div class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills">
              ${skillsHTML}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const exportPDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: generateHTML(),
        base64: false
      });

      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri);
      } else {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Resume PDF'
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

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
      <Card.Title style={styles.sectionTitle}>{title}</Card.Title>
      <Card.Divider />
      {typeof content === 'string' ? (
        <Text style={styles.text}>{content}</Text>
      ) : Array.isArray(content) ? (
        <View style={styles.skillsContainer}>
          {content.map((item, index) => (
            <Chip
              key={index}
              title={item}
              type="solid"
              containerStyle={styles.chip}
            />
          ))}
        </View>
      ) : (
        Object.entries(content).map(([key, value], index) => (
          <Text key={index} style={styles.text}>{key}: {value}</Text>
        ))
      )}
    </Card>
  );

  const renderWorkExperience = () => (
    <Card containerStyle={styles.section}>
      <Card.Title style={styles.sectionTitle}>Work Experience</Card.Title>
      <Card.Divider />
      {resume.workExperience.map((exp, index) => (
        <View key={index} style={styles.experienceItem}>
          <Text style={styles.jobTitle}>{exp.position}</Text>
          <Text style={styles.company}>{exp.company}</Text>
          <Text style={styles.date}>{exp.startDate} - {exp.endDate}</Text>
          <Text style={styles.description}>{exp.description}</Text>
          {index < resume.workExperience.length - 1 && <Card.Divider style={styles.divider} />}
        </View>
      ))}
    </Card>
  );

  const renderEducation = () => (
    <Card containerStyle={styles.section}>
      <Card.Title style={styles.sectionTitle}>Education</Card.Title>
      <Card.Divider />
      {resume.education.map((edu, index) => (
        <View key={index} style={styles.educationItem}>
          <Text style={styles.degree}>{edu.degree}</Text>
          <Text style={styles.school}>{edu.school}</Text>
          <Text style={styles.date}>{edu.year}</Text>
          <Text style={styles.description}>{edu.description}</Text>
          {index < resume.education.length - 1 && <Card.Divider style={styles.divider} />}
        </View>
      ))}
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.headerCard}>
        <Text h2 style={styles.name}>{resume.personalInfo.fullName}</Text>
        <View style={styles.contactContainer}>
          <View style={styles.contactItem}>
            <Icon name="email" type="material" color="#fff" size={16} />
            <Text style={styles.contact}>{resume.personalInfo.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="phone" type="material" color="#fff" size={16} />
            <Text style={styles.contact}>{resume.personalInfo.phone}</Text>
          </View>
        </View>
      </Card>

      {renderSection('Professional Summary', resume.summary)}
      {renderWorkExperience()}
      {renderEducation()}
      {renderSection('Skills', resume.skills)}

      <View style={styles.buttonContainer}>
        <Button
          title="Export PDF"
          onPress={exportPDF}
          icon={<Icon name="picture-as-pdf" type="material" color="white" style={styles.buttonIcon} />}
          containerStyle={[styles.button, { marginRight: 10 }]}
        />
        <Button
          title="Share JSON"
          onPress={shareResume}
          icon={<Icon name="share" type="material" color="white" style={styles.buttonIcon} />}
          containerStyle={styles.button}
        />
      </View>
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
  contactContainer: {
    alignItems: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  contact: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
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
  sectionTitle: {
    fontSize: 20,
    color: '#2c3e50',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#2c3e50',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  chip: {
    margin: 4,
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  company: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  description: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 20,
  },
  divider: {
    marginVertical: 10,
  },
  educationItem: {
    marginBottom: 15,
  },
  degree: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  school: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    flex: 1,
  },
  buttonIcon: {
    marginRight: 10,
  },
}); 