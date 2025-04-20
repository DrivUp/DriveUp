import { createRideService,getFare,confirmRide,startRide,endRide} from "../services/ride.service.js";
import { validationResult } from "express-validator";
import rideModel from "../models/ride.model.js";
import {getAddressCoordinate,getCaptainsInTheRadius} from "../services/maps.service.js";
import captainModel from "../models/captain.model.js";
import {sendMessageToSocketId} from "../socket.js";

export const createRideController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { userId, pickup, destination, vehicleType } = req.body;
  
    try {
     
      const ride = await createRideService({
        user: req.user._id,
        pickup,
        destination,
        vehicleType
      });
  
     
      const pickupCoordinates = await getAddressCoordinate(pickup);
      const ltd = parseFloat(pickupCoordinates.lat);
      const lng = parseFloat(pickupCoordinates.lng);
      const radius = 2.0;
      
// console.log("pickupCoordinates:", pickupCoordinates);

      if (isNaN(ltd) || isNaN(lng) || isNaN(radius)) {
        return res.status(400).json({ error: "Invalid coordinates or radius" });
      }
  
      
      const captainsInRadius = await getCaptainsInTheRadius(ltd, lng, radius,vehicleType);
      // console.log("Nearby Captains:", captainsInRadius);
  
      
      ride.otp = "";
  
      
      const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate("user");
  
      captainsInRadius.forEach((captain) => {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: rideWithUser
        });
      });
  
      
      return res.status(201).json(rideWithUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  };

// export const createRdeController = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, pickup, destination, vehicleType } = req.body;

//     try {
//         const ride = await createRideService({ user: req.user._id, pickup, destination, vehicleType });
//         res.status(201).json(ride);
//         const pickupCoordinates = await getAddressCoordinate(pickup);
//         const captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

//         ride.otp = ""

//         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

//         captainsInRadius.map(captain => {

//             sendMessageToSocketId(captain.socketId, {
//                 event: 'new-ride',
//                 data: rideWithUser
//             })

//         })
//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }

// };
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

export const startride = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
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