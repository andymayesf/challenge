import { Patient } from '../types/patient';

const API_URL = 'https://63bedcf7f5cfc0949b634fc8.mockapi.io/users';

export const fetchPatients = async (): Promise<Patient[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }
    const data = await response.json();

    // The API response already matches our Patient type, just return it directly
    return data.map((user: any) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      description: user.description || 'No description available',
      website: user.website || 'No website available',
      createdAt: user.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};
