// components/RouteMap.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Fix for Leaflet marker icons in React
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [35, 35],
});

const captainIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
  iconSize: [35, 35],
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [35, 35],
});

const RouteMap = ({ pickup, destination, ride }) => {
  const [route, setRoute] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [captainCoords, setCaptainCoords] = useState(null);
  const [error, setError] = useState(null);

  // Set default Leaflet icon
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  // Get coordinates when pickup/destination changes
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (pickup && destination) {
        try {
          setError(null);
          
          // Fetch pickup coordinates
          const pickupRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
            params: { address: pickup },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          
          if (!pickupRes.data?.lat || !pickupRes.data?.lng) {
            throw new Error('Invalid pickup coordinates');
          }
          setPickupCoords(pickupRes.data);

          // Fetch destination coordinates
          const destRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
            params: { address: destination },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          
          if (!destRes.data?.lat || !destRes.data?.lng) {
            throw new Error('Invalid destination coordinates');
          }
          setDestinationCoords(destRes.data);

          // If we have a ride, get captain coordinates
          if (ride?._id) {
            try {
              const rideRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/coordinates/${ride._id}`);
              if (rideRes.data?.captain?.lat && rideRes.data?.captain?.lng) {
                setCaptainCoords(rideRes.data.captain);
              }
            } catch (rideError) {
              console.error('Error fetching captain coordinates:', rideError);
            }
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
          setError('Failed to load map data. Please try again.');
        }
      }
    };

    fetchCoordinates();
  }, [pickup, destination, ride]);

  // Calculate route when we have both coordinates
  useEffect(() => {
    if (pickupCoords && destinationCoords) {
      const fetchRoute = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
            params: {
              origin: `${pickupCoords.lat},${pickupCoords.lng}`,
              destination: `${destinationCoords.lat},${destinationCoords.lng}`
            },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          
          // Create a simple straight line if no polyline is available
          if (!res.data?.polyline) {
            setRoute([
              [pickupCoords.lat, pickupCoords.lng],
              [destinationCoords.lat, destinationCoords.lng]
            ]);
          } else {
            // If your API provides encoded polyline, decode it here
            // For now, we'll use a straight line
            setRoute([
              [pickupCoords.lat, pickupCoords.lng],
              [destinationCoords.lat, destinationCoords.lng]
            ]);
          }
        } catch (error) {
          console.error('Error fetching route:', error);
          // Fallback to straight line if route API fails
          setRoute([
            [pickupCoords.lat, pickupCoords.lng],
            [destinationCoords.lat, destinationCoords.lng]
          ]);
        }
      };
      fetchRoute();
    }
  }, [pickupCoords, destinationCoords]);

  if (error) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!pickup || !destination) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p>Please enter both pickup and destination locations</p>
      </div>
    );
  }

  if (!pickupCoords || !destinationCoords) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p>Loading map data...</p>
      </div>
    );
  }

  // Calculate center point between pickup and destination
  const center = [
    (pickupCoords.lat + destinationCoords.lat) / 2,
    (pickupCoords.lng + destinationCoords.lng) / 2
  ];

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Pickup Marker */}
        <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={userIcon}>
          <Popup>Pickup Location</Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={[destinationCoords.lat, destinationCoords.lng]} icon={destinationIcon}>
          <Popup>Destination</Popup>
        </Marker>

        {/* Captain Marker (if available) */}
        {captainCoords && (
          <Marker position={[captainCoords.lat, captainCoords.lng]} icon={captainIcon}>
            <Popup>Captain</Popup>
          </Marker>
        )}

        {/* Route between pickup and destination */}
        {route && (
          <Polyline 
            positions={route} 
            color="blue"
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;