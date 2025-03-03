import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Swipeable } from 'react-native-gesture-handler';
import { usePatients } from '../context/PatientContext';
import PatientCard from '../components/PatientCard';
import Button from '../components/Button';
import Notification from '../components/Notification';
import { Patient } from '../types/patient';
import { RootStackParamList } from '../navigation/AppNavigator';

type PatientListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PatientList'>;

export default function PatientListScreen() {
    const { patients, loading, error, notification, deletePatient } = usePatients();
    const navigation = useNavigation<PatientListScreenNavigationProp>();

    const swipeableRefs = React.useRef<Map<string, Swipeable>>(new Map());

    const handleAddPatient = () => {
        navigation.navigate('PatientForm', { patient: undefined });
    };

    const handleEditPatient = (patient: Patient) => {
        navigation.navigate('PatientForm', { patient });
    };

    const handleDeletePatient = (patient: Patient) => {
        Alert.alert(
            "Delete Patient",
            `Are you sure you want to delete ${patient.name}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => {
                        // Close the swipeable
                        const swipeable = swipeableRefs.current.get(patient.id);
                        if (swipeable) {
                            swipeable.close();
                        }
                    }
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deletePatient(patient.id)
                }
            ]
        );
    };

    const renderRightActions = (patient: Patient) => {
        return (
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePatient(patient)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    const renderPatientItem = ({ item }: { item: Patient }) => {
        return (
            <Swipeable
                ref={(ref) => {
                    if (ref) {
                        swipeableRefs.current.set(item.id, ref);
                    } else {
                        swipeableRefs.current.delete(item.id);
                    }
                }}
                renderRightActions={() => renderRightActions(item)}
                friction={2}
                rightThreshold={40}
            >
                <PatientCard patient={item} onEdit={handleEditPatient} />
            </Swipeable>
        );
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

            <FlatList
                data={patients}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPatientItem}
                contentContainerStyle={styles.list}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={handleAddPatient}
                activeOpacity={0.8}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            {notification && (
                <Notification message={notification.message} type={notification.type} />
            )}
        </SafeAreaView>
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
        paddingBottom: 80, // Add padding to avoid FAB overlap
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
    deleteButton: {
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: '600',
        padding: 20,
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#3498db',
        borderRadius: 28,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabIcon: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    }
});
