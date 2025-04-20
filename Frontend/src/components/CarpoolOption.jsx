import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const CarpoolOptions = ({ pickup, destination, onSelect, onClose }) => {
    const [carpools, setCarpools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (pickup && destination) {
            fetchMatchingCarpools();
        }
    }, [pickup, destination]);

    const fetchMatchingCarpools = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/carpool/find`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCarpools(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to find matching carpools');
        } finally {
            setLoading(false);
        }
    };

    useGSAP(() => {
        gsap.from(".carpool-item", {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.3,
            ease: "power2.out"
        });
    }, [carpools]);

    const handleJoin = async (carpool) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/carpool/join`, {
                carpoolId: carpool.carpool._id,
                pickup,
                destination
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            onSelect(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join carpool');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Available Carpools</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                {loading && <div className="text-center py-4">Searching for carpools...</div>}
                {error && <div className="text-red-500 mb-4">{error}</div>}

                {!loading && carpools.length === 0 && (
                    <div className="text-center py-4">
                        No matching carpools found. You can create your own.
                    </div>
                )}

                <div className="space-y-4">
                    {carpools.map((carpool, index) => (
                        <div key={index} className="carpool-item p-4 border rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <i className="ri-user-line text-blue-500"></i>
                                </div>
                                <div>
                                    <h3 className="font-medium">{carpool.carpool.ride.user.fullname.firstname}</h3>
                                    <p className="text-sm text-gray-500">
                                        {carpool.carpool.ride.availableSeats} seat{carpool.carpool.ride.availableSeats !== 1 ? 's' : ''} available
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm mb-2">
                                <i className="ri-map-pin-line text-blue-500"></i>
                                <span>{carpool.carpool.ride.pickup}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm mb-3">
                                <i className="ri-flag-line text-red-500"></i>
                                <span>{carpool.carpool.ride.destination}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-lg font-semibold">
                                    ₹{carpool.fare} <span className="text-sm text-gray-500 line-through">₹{Math.round(carpool.fare / 0.7)}</span>
                                    <span className="ml-2 text-sm text-green-600">(30% off)</span>
                                </div>
                                <button 
                                    onClick={() => handleJoin(carpool)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    Join Ride
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                    <button 
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                        Create New Ride Instead
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarpoolOptions;