import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usePatients } from '../context/PatientContext';
import PatientForm from '../components/PatientForm';
import { Patient } from '../types/patient';
import { RootStackParamList } from '../navigation/AppNavigator';

type PatientFormScreenRouteProp = RouteProp<RootStackParamList, 'PatientForm'>;
type PatientFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PatientForm'>;

export default function PatientFormScreen() {
    const { addPatient, updatePatient, deletePatient } = usePatients();
    const navigation = useNavigation<PatientFormScreenNavigationProp>();
    const route = useRoute<PatientFormScreenRouteProp>();
    const { patient } = route.params || {};

    const handleSubmit = (patientData: Patient | Omit<Patient, 'id'>) => {
        if ('id' in patientData) {
            console.log('Updating patient:', patientData);
            console.log('Patient ID:', patientData.id);
            updatePatient(patientData);
        } else {
            addPatient(patientData);
        }
        navigation.goBack();
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleDelete = (patient: Patient) => {
        deletePatient(patient.id);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <PatientForm
                patient={patient}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onDelete={patient ? handleDelete : undefined}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    }
});
