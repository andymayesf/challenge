import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import Input from './Input';
import Button from './Button';
import { Patient } from '../types/patient';

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (patient: Omit<Patient, 'id'> | Patient) => void;
  onCancel: () => void;
  onDelete?: (patient: Patient) => void;
}

interface FormErrors {
  name?: string;
  website?: string;
  avatar?: string;
  description?: string;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSubmit, onCancel, onDelete }) => {
  const [form, setForm] = useState<Omit<Patient, 'id'> | Patient>({
    name: '',
    website: '',
    avatar: '',
    description: '',
    createdAt: new Date().toISOString(),
    ...(patient || {}),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.website.trim()) {
      newErrors.website = 'Website is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call to show loading state
      setTimeout(() => {
        onSubmit(form);
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });

    // Clear error when user types
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleDelete = () => {
    if (patient && onDelete) {
      Alert.alert(
        "Delete Patient",
        `Are you sure you want to delete ${patient.name}?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => onDelete(patient)
          }
        ]
      );
    }
  };

  return (
    <ScrollView>
      <Input
        label="Name"
        value={form.name}
        onChangeText={(value) => handleChange('name', value)}
        placeholder="Enter patient name"
        error={errors.name}
      />

      <Input
        label="Website"
        value={form.website}
        onChangeText={(value) => handleChange('website', value)}
        placeholder="Enter website URL"
        error={errors.website}
      />

      <Input
        label="Avatar URL (optional)"
        value={form.avatar}
        onChangeText={(value) => handleChange('avatar', value)}
        placeholder="Enter avatar URL"
        error={errors.avatar}
      />

      <Input
        label="Description"
        value={form.description}
        onChangeText={(value) => handleChange('description', value)}
        placeholder="Enter patient description"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={styles.textArea}
        error={errors.description}
      />

      <View style={styles.actionButtons}>
        <View style={styles.mainButtons}>
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title={patient ? 'Update' : 'Add Patient'}
            onPress={handleSubmit}
            loading={isSubmitting}
          />
        </View>
      </View>

      {patient && onDelete && (
        <View style={styles.deleteContainer}>
          <Button
            title="Delete Patient"
            onPress={handleDelete}
            variant="danger"
            style={styles.deleteButton}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textArea: {
    height: 100,
  },
  actionButtons: {
    marginTop: 16,
  },
  mainButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 12,
  },
  deleteContainer: {
    paddingTop: 24,
  },
  deleteButton: {
    width: '100%',
  }
});

export default PatientForm;
