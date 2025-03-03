import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Patient } from '../types/patient';
import { fetchPatients } from '../services/patientService';

interface PatientContextType {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (patient: Patient) => void;
  setNotification: (message: string, type: 'success' | 'error') => void;
  notification: { message: string; type: 'success' | 'error' } | null;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotificationState] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await fetchPatients();
        setPatients(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load patients');
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const addPatient = (patientData: Omit<Patient, 'id'>) => {
    const newId = patients.length > 0
      ? (Math.max(...patients.map(p => parseInt(p.id))) + 1).toString()
      : "1";

    const newPatient: Patient = {
      ...patientData,
      id: newId,
    };

    setPatients([newPatient, ...patients]);
    setNotification(`Patient ${newPatient.name} added successfully`, 'success');
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(
      patients.map(patient =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
    setNotification(`Patient ${updatedPatient.name} updated successfully`, 'success');
  };

  const setNotification = (message: string, type: 'success' | 'error') => {
    setNotificationState({ message, type });
    setTimeout(() => {
      setNotificationState(null);
    }, 3000);
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        loading,
        error,
        addPatient,
        updatePatient,
        notification,
        setNotification,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};
