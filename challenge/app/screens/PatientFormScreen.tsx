import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usePatients } from '../context/PatientContext';
import PatientForm from '../components/PatientForm';
import { Patient } from '../types/patient';
import { RootStackParamList } from '../navigation/AppNavigator';

type PatientFormScreenRouteProp = RouteProp<RootStackParamList, 'PatientForm'>;
type PatientFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PatientForm'>;

export default function PatientFormScreen() {
    const { addPatient, updatePatient } = usePatients();
    const navigation = useNavigation<PatientFormScreenNavigationProp>();
    const route = useRoute<PatientFormScreenRouteProp>();
    const { patient } = route.params || {};

    const handleSubmit = (patientData: Patient | Omit<Patient, 'id'>) => {
        if ('id' in patientData) {
            updatePatient(patientData);
        } else {
            addPatient(patientData);
        }
        navigation.goBack();
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <PatientForm
                patient={patient}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
});
