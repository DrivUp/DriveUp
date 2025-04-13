import { createRideService,getFare } from "../services/ride.service.js";
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
        const ride = await createRideService({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);
        const pickupCoordinates = await getAddressCoordinate(pickup);
        const captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.map(captain => {

            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })

        })
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};
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
