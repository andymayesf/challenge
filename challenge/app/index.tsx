import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { PatientProvider, usePatients } from './context/PatientContext';
import PatientCard from './components/PatientCard';
import Button from './components/Button';
import Modal from './components/Modal';
import PatientForm from './components/PatientForm';
import Notification from './components/Notification';
import { Patient } from './types/patient';

function PatientList() {
  const { patients, loading, error, addPatient, updatePatient, notification } = usePatients();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined);

  const handleAddPatient = () => {
    setSelectedPatient(undefined);
    setModalVisible(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

  const handleSubmit = (patientData: Patient | Omit<Patient, 'id'>) => {
    if ('id' in patientData) {
      updatePatient(patientData);
    } else {
      addPatient(patientData);
    }
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading patients...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={() => window.location.reload()} style={styles.retryButton} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Patient Records</Text>
        <Button title="Add Patient" onPress={handleAddPatient} />
      </View>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PatientCard patient={item} onEdit={handleEditPatient} />
        )}
        contentContainerStyle={styles.list}
      />

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={selectedPatient ? 'Edit Patient' : 'Add New Patient'}
      >
        <PatientForm
          patient={selectedPatient}
          onSubmit={handleSubmit}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </SafeAreaView>
  );
}

export default function Index() {
  return (
    <PatientProvider>
      <PatientList />
    </PatientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  list: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
  },
});
