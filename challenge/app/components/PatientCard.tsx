import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Linking } from 'react-native';
import Card from './Card';
import Button from './Button';
import { Patient } from '../types/patient';

interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
}

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

const PatientCard: React.FC<PatientCardProps> = ({ patient, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [avatarError, setAvatarError] = useState(false);
  const [contentHeight, setContentHeight] = useState(160);
  const contentRef = useRef<View>(null);

  // Measure the actual content height
  useEffect(() => {
    if (contentRef.current && expanded) {
      contentRef.current.measure((x, y, width, height) => {
        if (height > 0) {
          setContentHeight(height);
        }
      });
    }
  }, [expanded, patient.description]);

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
    outputRange: [0, contentHeight],
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

  const avatarSource = avatarError || !patient.avatar
    ? { uri: DEFAULT_AVATAR }
    : { uri: patient.avatar };

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={avatarSource}
            style={styles.headerAvatar}
            onError={() => setAvatarError(true)}
          />
          <Text style={styles.name}>{patient.name}</Text>
        </View>
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
        <View ref={contentRef} style={styles.contentMeasure}>
          <Text style={styles.detailText}>📝 {patient.description}</Text>
        </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
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
  contentMeasure: {
    position: 'absolute',
    width: '100%',
    paddingBottom: 8,
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
