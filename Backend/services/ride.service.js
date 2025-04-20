import rideModel from "../models/ride.model.js";
import captainModel from "../models/captain.model.js";
import {getDistanceTime1} from "../services/maps.service.js";
import Carpool from "../models/carpool.model.js";
import crypto from "crypto";

export async function getFare(pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

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



    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };
    console.log("Fare Calculation:",distanceTime.distance.value/1000);
    // console.log("Fare Calculation:",distanceTime.duration.value/3600);
    return {fare:fare, distance: distanceTime.distance.value/1000};


}

// Add these new functions to ride.service.js:

export const generatePassengerOTP = async (carpoolId, userId) => {
    const carpool = await Carpool.findById(carpoolId);
    if (!carpool) {
        throw new Error('Carpool not found');
    }

    const passenger = carpool.passengers.find(p => p.user.toString() === userId.toString());
    if (!passenger) {
        throw new Error('Passenger not found in this carpool');
    }

    // Generate OTP
    passenger.otp = getOtp(6);
    await carpool.save();

    return passenger.otp;
};

export const verifyPassengerOTP = async (carpoolId, userId, otp) => {
    const carpool = await Carpool.findById(carpoolId).populate('ride');
    if (!carpool) {
        throw new Error('Carpool not found');
    }

    const passenger = carpool.passengers.find(p => p.user.toString() === userId.toString());
    if (!passenger) {
        throw new Error('Passenger not found in this carpool');
    }

    if (passenger.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    // Update passenger status
    passenger.status = 'otp-verified';
    await carpool.save();

    // Check if all passengers have verified OTP
    const allVerified = carpool.passengers.every(p => p.status === 'otp-verified');
    if (allVerified) {
        // Update ride status to ongoing for all
        await rideModel.findByIdAndUpdate(carpool.ride._id, { status: 'ongoing' });
        
        // Notify all passengers that ride has started
        return { verified: true, rideStarted: true };
    }

    return { verified: true, rideStarted: false };
};


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


export const createRideService = async ({
    user, pickup, destination, vehicleType, isCarpool = false, availableSeats = 1, departureTime
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);

    const rideData = {
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare.fare[vehicleType],
        distance: fare.distance,
        isCarpool,
        availableSeats
    };

    if (departureTime) {
        rideData.departureTime = departureTime;
    }

    const ride = await rideModel.create(rideData);
    
    // If it's a carpool, create a carpool entry
    if (isCarpool) {
        await Carpool.create({
            ride: ride._id,
            status: 'searching'
        });
    }

    return ride;
};


export const confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');


    if (!ride) {
        throw new Error('Ride not found');
    }
    await captainModel.findOneAndUpdate({
        _id: captain._id
    }, {
        $inc: {
            tripsCompleted: 1,
            totalEarnings: ride.fare*0.9,
            totalDistance: ride.distance,
        }
    })
    

    return ride;

}

export const startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

export const endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}

