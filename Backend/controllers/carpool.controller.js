import { validationResult } from 'express-validator';
import { sendMessageToSocketId } from '../socket.js';
import rideModel from '../models/ride.model.js';
import userModel from '../models/user.model.js';
import { joinCarpool,findMatchingCarpools } from '../services/carPool.service.js';
export const findMatchingCarpoolsController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const matchingCarpools = await findMatchingCarpools(pickup, destination);
        return res.status(200).json(matchingCarpools);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const joinCarpoolController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { carpoolId, pickup, destination } = req.body;

    try {
        const result = await joinCarpool(
            carpoolId,
            req.user._id,
            pickup,
            destination
        );

        // Notify ride creator about new passenger
        const ride = await rideModel.findById(result.carpool.ride._id)
            .populate('user')
            .populate('captain');
            
        const passenger = await userModel.findById(req.user._id);

        if (ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: "passenger-joined",
                data: {
                    carpoolId: result.carpool._id,
                    passenger: {
                        _id: passenger._id,
                        fullname: passenger.fullname,
                        pickup,
                        destination,
                        fare: result.fare
                    }
                }
            });
        }

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getCarpoolDetails = async (req, res) => {
    const { carpoolId } = req.params;

    try {
        const carpool = await Carpool.findById(carpoolId)
            .populate('ride')
            .populate('passengers.user');

        if (!carpool) {
            return res.status(404).json({ message: 'Carpool not found' });
        }

        return res.status(200).json(carpool);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Add these new controller methods:

export const generatePassengerOTPController = async (req, res) => {
    const { carpoolId } = req.params;

    try {
        const otp = await generatePassengerOTP(carpoolId, req.user._id);
        return res.status(200).json({ otp });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const verifyPassengerOTPController = async (req, res) => {
    const { carpoolId } = req.params;
    const { otp } = req.body;

    try {
        const result = await verifyPassengerOTP(carpoolId, req.user._id, otp);
        
        if (result.rideStarted) {
            // Notify all passengers that ride has started
            const carpool = await Carpool.findById(carpoolId).populate('ride').populate('passengers.user');
            
            carpool.passengers.forEach(passenger => {
                if (passenger.user.socketId) {
                    sendMessageToSocketId(passenger.user.socketId, {
                        event: "ride-started",
                        data: {
                            carpoolId,
                            passengerId: passenger.user._id
                        }
                    });
                }
            });
        }
        
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};