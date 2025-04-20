import { createRideService,getFare,confirmRide,startRide,endRide} from "../services/ride.service.js";
import { validationResult } from "express-validator";
import rideModel from "../models/ride.model.js";
import {getAddressCoordinate,getCaptainsInTheRadius} from "../services/maps.service.js";
import captainModel from "../models/captain.model.js";
import {sendMessageToSocketId} from "../socket.js";
import Carpool from '../models/carpool.model.js';


export const createRideController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType, isCarpool, availableSeats, departureTime } = req.body;

  try {
      const ride = await createRideService({
          user: req.user._id,
          pickup,
          destination,
          vehicleType,
          isCarpool: isCarpool || false,
          availableSeats: availableSeats || 1,
          departureTime
      });

      const pickupCoordinates = await getAddressCoordinate(pickup);
      const ltd = parseFloat(pickupCoordinates.lat);
      const lng = parseFloat(pickupCoordinates.lng);
      const radius = 2.0;

      if (isNaN(ltd) || isNaN(lng) || isNaN(radius)) {
          return res.status(400).json({ error: "Invalid coordinates or radius" });
      }
  
      
      const captainsInRadius = await getCaptainsInTheRadius(ltd, lng, radius,vehicleType);
      // console.log("Nearby Captains:", captainsInRadius);
  
      
      ride.otp = "";

      const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate("user");

      // Notify captains based on ride type
      const eventName = ride.isCarpool ? "new-carpool-ride" : "new-ride";
      
      captainsInRadius.forEach((captain) => {
          sendMessageToSocketId(captain.socketId, {
              event: eventName,
              data: rideWithUser
          });
      });

      return res.status(201).json(rideWithUser);
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
  }
};

export const getfare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const data = await getFare(pickup, destination);
        
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const confirmride = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await confirmRide({ rideId, captain: req.captain });
        // console.log(ride);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

// Modify the startride controller to handle carpool rides differently:
export const startride = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideModel.findOne({
            _id: rideId
        }).populate('user').populate('captain').select('+otp');

        if (!ride) {
            throw new Error('Ride not found');
        }

        // Handle carpool rides differently
        if (ride.isCarpool) {
            const carpool = await Carpool.findOne({ ride: rideId });
            if (!carpool) {
                throw new Error('Carpool not found');
            }

            // For carpool, captain verifies their OTP separately
            if (ride.otp !== otp) {
                throw new Error('Invalid OTP');
            }

            // Update captain's verification status
            ride.captainVerified = true;
            await ride.save();

            // Check if all passengers have also verified
            const allPassengersVerified = carpool.passengers.every(p => p.status === 'otp-verified');
            
            if (allPassengersVerified && ride.captainVerified) {
                await rideModel.findOneAndUpdate({
                    _id: rideId
                }, {
                    status: 'ongoing'
                });

                // Notify all participants
                sendMessageToSocketId(ride.user.socketId, {
                    event: 'ride-started',
                    data: ride
                });

                carpool.passengers.forEach(async (passenger) => {
                    const user = await userModel.findById(passenger.user);
                    if (user.socketId) {
                        sendMessageToSocketId(user.socketId, {
                            event: 'ride-started',
                            data: ride
                        });
                    }
                });
            }

            return res.status(200).json({ 
                message: 'Captain OTP verified', 
                rideStarted: allPassengersVerified && ride.captainVerified 
            });
        } else {
            // Original non-carpool logic
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
            });

            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-started',
                data: ride
            });

            return res.status(200).json(ride);
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const endride = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } s
}
// ride.controller.js
export const getRideCoordinates = async (req, res) => {
    try {
      const { rideId } = req.params;
  
      const ride = await rideModel.findById(rideId).populate('captain');
      if (!ride || !ride.captain) {
        return res.status(404).json({ message: "Ride or captain not found" });
      }
  
      const pickupCoords = await getAddressCoordinate(ride.pickup);
  
      const captainCoords = ride.captain.location;
  
      res.status(200).json({
        user: pickupCoords,
        captain: {
          lat: captainCoords?.ltd,
          lng: captainCoords?.lng
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const rateCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { rideId, rating } = req.body;
  
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }
  
    try {
      const ride = await rideModel.findById(rideId).populate("captain");
      if (!ride || !ride.captain) {
        return res.status(404).json({ message: "Ride or captain not found" });
      }
  
      const captain = ride.captain;
  
      // Initialize if not present
      captain.tripsCompleted = captain.tripsCompleted || 0;
      captain.avgRating = captain.avgRating || 0;
  
      // Update the average rating
      captain.avgRating = ((captain.avgRating * (captain.tripsCompleted-1)) + rating) / (captain.tripsCompleted);
      //captain.ratingCount += 1;
  
      await captain.save();
  
      return res.status(200).json({ message: "Rating submitted", captain });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };  