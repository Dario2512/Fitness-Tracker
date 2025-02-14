import axios from 'axios';
import Constants from 'expo-constants';
//require('dotenv').config();

const MAPS_API_KEY = Constants.expoConfig?.extra?.mapsApiKey; // Fetch API Key

export const fetchNearbyPlaces = async (coords: {
  latitude: number;
  longitude: number;
}): Promise<any[]> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${coords.latitude},${coords.longitude}`,
          radius: 5000, // 5 km radius
          type: 'gym|stadium|hospital', // Filter types
          key: MAPS_API_KEY,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};
