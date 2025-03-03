import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Input from './Input';
import Button from './Button';
import { Patient } from '../types/patient';

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (patient: Omit<Patient, 'id'> | Patient) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  website?: string;
  avatar?: string;
  description?: string;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSubmit, onCancel }) => {
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
    } else if (!/^https?:\/\//.test(form.website)) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
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

  return (
    <ScrollView>
      <Input
        label="Name"
        value={form.name}
        onChangeText={(value) => handleChange('name', value)}
        placeholder="John Doe"
        error={errors.name}
      />

      <Input
        label="Website"
        value={form.website}
        onChangeText={(value) => handleChange('website', value)}
        placeholder="https://example.com"
        keyboardType="url"
        autoCapitalize="none"
        error={errors.website}
      />

      <Input
        label="Avatar URL"
        value={form.avatar}
        onChangeText={(value) => handleChange('avatar', value)}
        placeholder="https://example.com/avatar.jpg"
        keyboardType="url"
        autoCapitalize="none"
        error={errors.avatar}
      />

      <Input
        label="Description"
        value={form.description}
        onChangeText={(value) => handleChange('description', value)}
        placeholder="Patient description..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={styles.textArea}
        error={errors.description}
      />

      <View style={styles.buttons}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textArea: {
    height: 100,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 12,
  },
});

export default PatientForm;
