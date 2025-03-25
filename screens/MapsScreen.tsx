import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { fetchNearbyPlaces, fetchAutocompleteSuggestions } from '../backend/apiService';
import { FAB, Portal, Provider } from 'react-native-paper';
import styles from './styles/stylesMaps';
import axios from 'axios';
import Constants from 'expo-constants';

const MAPS_API_KEY = Constants.expoConfig?.extra?.mapsApiKey; 

const MapsScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [places, setPlaces] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search bar input
  const [suggestions, setSuggestions] = useState<Array<any>>([]); // Autocomplete suggestions
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [filterType, setFilterType] = useState<string>('gym'); // Filter type
  const [open, setOpen] = useState<boolean>(false); // FAB open state

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
            timeInterval: 5000,
            distanceInterval: 10,
          },
          async (newLocation) => {
            setLocation(newLocation);
            const nearbyPlaces = await fetchNearbyPlaces(newLocation.coords, filterType);
            setPlaces(nearbyPlaces);
            setLoading(false);
          }
        );
      } catch (err) {
        setError('Error fetching location.');
        setLoading(false);
      }
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [filterType]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2 && location) {
      const suggestions = await fetchAutocompleteSuggestions(query, location.coords);
      setSuggestions(suggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionPress = async (placeId: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: MAPS_API_KEY,
          },
        }
      );

      const { lat, lng } = response.data.result.geometry.location;
      setDestination({ latitude: lat, longitude: lng });
      setSearchQuery(response.data.result.name);
      setSuggestions([]);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleFilterChange = async (type: string) => {
    setFilterType(type);
    if (location) {
      const nearbyPlaces = await fetchNearbyPlaces(location.coords, type);
      setPlaces(nearbyPlaces);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for places"
          placeholderTextColor="white" // Set the placeholder text color to white
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSuggestionPress(item.place_id)}>
                <Text style={styles.suggestionItem}>{item.description}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
          />
        )}
        <MapView
          style={styles.map}
          region={{
            latitude: location?.coords.latitude || 37.78825,
            longitude: location?.coords.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="My Location"
              pinColor="yellow"
            />
          )}
          {places.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
              pinColor="red"
            />
          ))}
          {destination && (
            <Marker
              coordinate={destination}
              title="Destination"
              pinColor="#013220"
            />
          )}
        </MapView>
        <Portal>
          <FAB.Group
            open={open}
            visible={true}
            icon={open ? 'close' : 'filter'}
            actions={[
              { icon: 'dumbbell', label: 'Gyms', onPress: () => handleFilterChange('gym'), color: '#FF6347', labelStyle: { color: '#FF6347' }, style: { backgroundColor: '#121212' } },
              { icon: 'stadium', label: 'Stadiums', onPress: () => handleFilterChange('stadium'), color: '#FF6347', labelStyle: { color: '#FF6347' }, style: { backgroundColor: '#121212' } },
              { icon: 'hospital', label: 'Hospitals', onPress: () => handleFilterChange('hospital'), color: '#FF6347', labelStyle: { color: '#FF6347' }, style: { backgroundColor: '#121212' } },
            ]}
            onStateChange={({ open }) => setOpen(open)}
            onPress={() => {
              if (open) {
                // Do something if the speed dial is open
              }
            }}
            style={styles.fab} // Apply the custom style
            fabStyle={{ backgroundColor: '#121212' }} // Set the main FAB button background color to gray
            color="#FF6347" // Set the icon color to red
            backdropColor="transparent" // Set the backdrop color to transparent
          />
        </Portal>
      </View>
    </Provider>
  );
};

export default MapsScreen;