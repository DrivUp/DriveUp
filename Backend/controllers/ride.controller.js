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
      
console.log("pickupCoordinates:", pickupCoordinates);

      if (isNaN(ltd) || isNaN(lng) || isNaN(radius)) {
        return res.status(400).json({ error: "Invalid coordinates or radius" });
      }
  
      
      const captainsInRadius = await getCaptainsInTheRadius(ltd, lng, radius);
      console.log("Nearby Captains:", captainsInRadius);
  
      
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
        const fare = await getFare(pickup, destination);
        
        return res.status(200).json(fare);
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
        console.log(ride);
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