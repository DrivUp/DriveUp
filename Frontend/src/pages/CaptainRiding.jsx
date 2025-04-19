import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FinishRide from '../components/FinishRide';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CaptainContext';
import ChatBox from '../components/ChatBox';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Configure Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  // Get coordinates for pickup and destination
  useEffect(() => {
    const getCoordinates = async () => {
      if (rideData?.pickup && rideData?.destination) {
        try {
          // Get pickup coordinates
          const pickupRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
            params: { address: rideData.pickup },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setPickupCoords(pickupRes.data);

          // Get destination coordinates
          const destRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
            params: { address: rideData.destination },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setDestinationCoords(destRes.data);
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      }
    };

    getCoordinates();
  }, [rideData]);

  // Get captain's current location
  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(coords);
          
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: coords
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 5000);
    updateLocation();

    return () => clearInterval(locationInterval);
  }, [captain._id, socket]);

  // Socket events and other existing code remains the same
  useEffect(() => {
    socket.emit('join', { userType: 'captain', userId: captain._id });

    socket.on('receive_message', (data) => {
      setChatMessages((prev) => [...prev, { from: data.fromId, text: data.message }]);
    });

    socket.on('ride-finished', () => {
      navigate('/captain-home');
    });

    return () => {
      socket.off('receive_message');
    };
  }, [captain, navigate, socket]);

  const sendMessage = () => {
    if (!rideData || !rideData.user) return;

    const msg = {
      fromId: captain._id,
      fromType: 'captain',
      toId: rideData.user._id,
      toType: 'user',
      message: messageInput
    };

    socket.emit('send_message', msg);
    setChatMessages((prev) => [...prev, { from: captain._id, text: messageInput }]);
    setMessageInput('');
  };

  useGSAP(() => {
    gsap.to(finishRidePanelRef.current, {
      transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)'
    });
  }, [finishRidePanel]);

  // Calculate map center
  const getMapCenter = () => {
    if (pickupCoords && currentLocation) {
      return [
        (pickupCoords.lat + currentLocation.lat) / 2,
        (pickupCoords.lng + currentLocation.lng) / 2
      ];
    }
    return pickupCoords || [0, 0];
  };

  // Calculate distance between captain and pickup
  const calculateDistance = () => {
    if (!pickupCoords || !currentLocation) return 'Calculating...';
    
    const R = 6371; // Earth's radius in km
    const dLat = (pickupCoords.lat - currentLocation.lat) * Math.PI / 180;
    const dLon = (pickupCoords.lng - currentLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(currentLocation.lat * Math.PI / 180) * 
      Math.cos(pickupCoords.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return `${distance.toFixed(1)} KM away`;
  };

  return (
    <div className='h-screen relative flex flex-col justify-end'>

      {/* Header */}
      <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-50 bg-white'>
        <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Map Section */}
      <div className='h-screen w-full fixed top-0 z-0'>
        {pickupCoords && (
          <MapContainer 
            center={getMapCenter()} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Pickup Marker */}
            {pickupCoords && (
              <Marker position={[pickupCoords.lat, pickupCoords.lng]}>
                <Popup>Pickup Location: {rideData?.pickup}</Popup>
              </Marker>
            )}
            
            {/* Destination Marker */}
            {destinationCoords && (
              <Marker position={[destinationCoords.lat, destinationCoords.lng]}>
                <Popup>Destination: {rideData?.destination}</Popup>
              </Marker>
            )}

            {/* Captain's Current Location */}
            {currentLocation && (
              <Marker position={[currentLocation.lat, currentLocation.lng]}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {/* Route from current location to pickup */}
            {currentLocation && pickupCoords && (
              <Polyline
                positions={[
                  [currentLocation.lat, currentLocation.lng],
                  [pickupCoords.lat, pickupCoords.lng]
                ]}
                color="blue"
                weight={3}
              />
            )}

            {/* Route from pickup to destination */}
            {pickupCoords && destinationCoords && (
              <Polyline
                positions={[
                  [pickupCoords.lat, pickupCoords.lng],
                  [destinationCoords.lat, destinationCoords.lng]
                ]}
                color="green"
                weight={3}
                dashArray="5, 5"
              />
            )}
          </MapContainer>
        )}
      </div>

      {/* Info Panel */}
      <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10 z-40'
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5 className='p-1 text-center w-[90%] absolute top-0'><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
        <h4 className='text-xl font-semibold'>{calculateDistance()}</h4>
        <button className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
      </div>

      {/* Finish Ride Panel */}
      <div ref={finishRidePanelRef} className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
        <FinishRide
          ride={rideData}
          setFinishRidePanel={setFinishRidePanel}
        />
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setChatOpen(true)}
        className='fixed bottom-24 right-4 bg-black text-white px-4 py-2 rounded-full z-50'
      >
        Chat
      </button>

      {/* ChatBox */}
      {chatOpen && (
        <ChatBox
          chatMessages={chatMessages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
          setChatOpen={setChatOpen}
          user={captain}
        />
      )}
    </div>
  );
};

export default CaptainRiding;