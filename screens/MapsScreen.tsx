import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { fetchNearbyPlaces } from '../backend/apiService';
import styles from './styles/stylesMaps';
import axios from 'axios';
//import { MAPS_API_KEY } from '@env';
import Constants from 'expo-constants';
const MAPS_API_KEY = Constants.expoConfig?.extra?.mapsApiKey; // Fetch API Key

const MapsScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [places, setPlaces] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search bar input
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied.');
          return;
        }

        // Subscribe to location changes
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Update every 5 seconds
            distanceInterval: 10, // Update if moved 10 meters
          },
          async (newLocation) => {
            setLocation(newLocation);

            // Fetch nearby gyms and hospitals
            const nearbyPlaces = await fetchNearbyPlaces(newLocation.coords);
            setPlaces(nearbyPlaces);
          }
        );
      } catch (err) {
        setError('Failed to load location data.');
      } finally {
        setLoading(false);
      }
    })();

    // Cleanup function to unsubscribe when unmounting
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Handle search input submission
  const handleSearch = async () => {
    if (!searchQuery) return;
    console.log("Fetching location for:", searchQuery); // Debugging
  
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: searchQuery,
            key: MAPS_API_KEY,
          },
        }
      );
  
      console.log("API Response:", response.data); // Debugging
  
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        setDestination({ latitude: lat, longitude: lng });
      } else {
        console.log("No results found.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text>Loading map and places...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Enter destination..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => {
        console.log("Searching for:", searchQuery); // Debugging
        handleSearch();
        }}  
      returnKeyType="search"
      />

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Current Location Marker */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            pinColor="red"
          />

          {/* Nearby Gyms & Hospitals */}
          {places.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
              pinColor="blue"
            />
          ))}

          {/* Destination Marker */}
          {destination && (
            <Marker
              coordinate={destination}
              title="Destination"
              pinColor="green"
            />
          )}
        </MapView>
      )}
    </View>
  );
};

export default MapsScreen;
