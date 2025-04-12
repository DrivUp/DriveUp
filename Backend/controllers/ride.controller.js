import { createRideService } from "../services/ride.service.js";
import { validationResult } from "express-validator";

export const createRideController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await createRideService({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};