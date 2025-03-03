import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PatientProvider } from './context/PatientContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <PatientProvider>
      <AppNavigator />
    </PatientProvider>
  );
}
