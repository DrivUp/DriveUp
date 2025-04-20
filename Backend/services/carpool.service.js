import Carpool from '../models/carpool.model.js';
import rideModel from '../models/ride.model.js';
import userModel from '../models/user.model.js';
import { getAddressCoordinate } from './maps.service.js';
import { getDistanceTime1 } from './maps.service.js';

export const createCarpool = async (rideId) => {
    if (!rideId) {
        throw new Error('Ride ID is required');
    }

    const ride = await rideModel.findById(rideId);
    if (!ride) {
        throw new Error('Ride not found');
    }

    if (!ride.isCarpool) {
        throw new Error('Ride is not a carpool');
    }

    const carpool = await Carpool.create({
        ride: rideId,
        status: 'searching'
    });

    return carpool;
};

export const findMatchingCarpools = async (pickup, destination, maxDistance = 2) => {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    // Get coordinates for pickup and destination
    const pickupCoords = await getAddressCoordinate(pickup);
    const destCoords = await getAddressCoordinate(destination);

    // Find active carpools with available seats
    const carpools = await Carpool.find({
        status: 'searching'
    }).populate({
        path: 'ride',
        match: { 
            status: 'pending',
            isCarpool: true,
            availableSeats: { $gt: 0 }
        }
    }).populate('passengers.user');

    // Filter out carpools where ride is null (due to the match condition)
    const validCarpools = carpools.filter(c => c.ride !== null);

    // Calculate distances and filter
    const matchingCarpools = await Promise.all(validCarpools.map(async (carpool) => {
        try {
            const ridePickupCoords = await getAddressCoordinate(carpool.ride.pickup);
            const rideDestCoords = await getAddressCoordinate(carpool.ride.destination);

            // Calculate distances (simplified for example)
            const pickupDistance = calculateDistance(
                pickupCoords.lat, pickupCoords.lng,
                ridePickupCoords.lat, ridePickupCoords.lng
            );
            
            const destDistance = calculateDistance(
                destCoords.lat, destCoords.lng,
                rideDestCoords.lat, rideDestCoords.lng
            );

            if (pickupDistance <= maxDistance && destDistance <= maxDistance) {
                // Calculate fare for this passenger (could be a fraction of total fare)
                const distanceTime = await getDistanceTime1(pickup, destination);
                const baseFare = {
                    auto: 30,
                    car: 50,
                    moto: 20
                };
                const perKmRate = {
                    auto: 10,
                    car: 15,
                    moto: 8
                };
                const perMinuteRate = {
                    auto: 2,
                    car: 3,
                    moto: 1.5
                };

                const fare = Math.round(
                    baseFare[carpool.ride.vehicleType] * 0.7 + // 30% discount for carpool
                    ((distanceTime.distance.value / 1000) * perKmRate[carpool.ride.vehicleType]) + 
                    ((distanceTime.duration.value / 60) * perMinuteRate[carpool.ride.vehicleType])
                );

                return {
                    carpool,
                    pickupDistance,
                    destDistance,
                    fare
                };
            }
            return null;
        } catch (error) {
            console.error('Error processing carpool:', error);
            return null;
        }
    }));

    return matchingCarpools.filter(c => c !== null);
};

export const joinCarpool = async (carpoolId, userId, pickup, destination) => {
    const carpool = await Carpool.findById(carpoolId).populate('ride');
    if (!carpool) {
        throw new Error('Carpool not found');
    }

    if (carpool.ride.availableSeats <= 0) {
        throw new Error('No available seats');
    }

    // Calculate fare for this passenger
    const distanceTime = await getDistanceTime1(pickup, destination);
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };
    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };
    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    const fare = Math.round(
        (baseFare[carpool.ride.vehicleType] * 0.7) + // 30% discount
        ((distanceTime.distance.value / 1000) * perKmRate[carpool.ride.vehicleType]) + 
        ((distanceTime.duration.value / 60) * perMinuteRate[carpool.ride.vehicleType])
    );

    // Add passenger to carpool
    carpool.passengers.push({
        user: userId,
        pickup,
        destination,
        fare,
        status: 'confirmed'
    });

    // Reduce available seats
    carpool.ride.availableSeats -= 1;
    
    // Update carpool status if full
    if (carpool.ride.availableSeats === 0) {
        carpool.status = 'matched';
    }

    await Promise.all([
        carpool.save(),
        carpool.ride.save()
    ]);

    return { carpool, fare };
};

// Helper function to calculate distance between coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}