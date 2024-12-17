import axios from 'axios';

require('dotenv').config();

const GOOGLE_MAPS_API_KEY = process.env.MAPS_API_KEY;

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
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};
