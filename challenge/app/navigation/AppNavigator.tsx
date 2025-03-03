import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PatientListScreen from '../screens/PatientListScreen';
import PatientFormScreen from '../screens/PatientFormScreen';
import { Patient } from '../types/patient';

export type RootStackParamList = {
    PatientList: undefined;
    PatientForm: { patient?: Patient };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="PatientList">
            <Stack.Screen
                name="PatientList"
                component={PatientListScreen}
                options={({ route }) => ({
                    title: 'Patients List'
                })}
            />
            <Stack.Screen
                name="PatientForm"
                component={PatientFormScreen}
                options={({ route }) => ({
                    title: route.params?.patient ? 'Edit Patient' : 'Add New Patient'
                })}
            />
        </Stack.Navigator>
    );
}
