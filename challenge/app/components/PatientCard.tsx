import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Linking } from 'react-native';
import Card from './Card';
import Button from './Button';
import { Patient } from '../types/patient';

interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  // Format the date
  const formattedDate = new Date(patient.createdAt).toLocaleDateString();

  const openWebsite = async () => {
    const url = `${patient.website}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(`Cannot open URL: ${url}`);
      }
    } catch (error) {
      console.error(`Error opening URL: ${error}`);
    }
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.name}>{patient.name}</Text>
        <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
          <Text style={styles.expandButtonText}>
            {expanded ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.basicInfo}>
        <TouchableOpacity onPress={openWebsite}>
          <Text style={[styles.infoText, styles.linkText]}>🌐 {patient.website}</Text>
        </TouchableOpacity>
        <Text style={styles.infoText}>📅 {formattedDate}</Text>
      </View>

      <Animated.View style={[styles.expandedContent, { height }]}>
        {patient.avatar && (
          <Image
            source={{ uri: patient.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        )}
        <Text style={styles.detailText}>📝 {patient.description}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Button
          title="Edit"
          variant="outline"
          onPress={() => onEdit(patient)}
          style={styles.editButton}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  expandButton: {
    padding: 4,
  },
  expandButtonText: {
    fontSize: 16,
    color: '#3498db',
  },
  basicInfo: {
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  linkText: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  expandedContent: {
    overflow: 'hidden',
  },
  detailText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 6,
  },
  avatar: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 0,
  },
});

export default PatientCard;
