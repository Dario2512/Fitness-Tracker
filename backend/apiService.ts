import axios from 'axios';
import Constants from 'expo-constants';

const MAPS_API_KEY = Constants.expoConfig?.extra?.mapsApiKey; // Fetch API Key

interface Prediction {
  description: string;
  place_id: string;
  types: string[];
}

export const fetchNearbyPlaces = async (coords: {
  latitude: number;
  longitude: number;
}, type: string): Promise<any[]> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${coords.latitude},${coords.longitude}`,
          radius: 5000, // 5 km radius
          type, // Use the filter type
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

export const fetchAutocompleteSuggestions = async (input: string, coords: {
  latitude: number;
  longitude: number;
}): Promise<Prediction[]> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input,
          key: MAPS_API_KEY,
          location: `${coords.latitude},${coords.longitude}`,
          radius: 5000, // 5 km radius
          types: 'establishment', // Filter types
        },
      }
    );
    return response.data.predictions.filter((prediction: Prediction) => 
      prediction.types.includes('gym') || 
      prediction.types.includes('hospital') || 
      prediction.types.includes('stadium')
    );
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return [];
  }
};