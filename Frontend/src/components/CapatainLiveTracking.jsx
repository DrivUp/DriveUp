import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [35, 35],
});

const captainIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
  iconSize: [35, 35],
});

const CaptainLiveTracking = ({ rideId }) => {
  const [locations, setLocations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/coordinates/${rideId}`);
        setLocations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [rideId]);

  if (loading) return <p>Loading captain tracking...</p>;
  if (!locations) return <p>Unable to load coordinates</p>;
  console.log('Captain Location:', locations.captain);

  const center = [locations.captain.lat, locations.captain.lng];
  return (
    <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[locations.captain.lat, locations.captain.lng]} icon={captainIcon}>
        <Popup>Captain Current Location</Popup>
      </Marker>

      <Marker position={[locations.user.lat, locations.user.lng]} icon={userIcon}>
        <Popup>User Pickup Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default CaptainLiveTracking;