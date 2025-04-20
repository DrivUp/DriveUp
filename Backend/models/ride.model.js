import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
    distance:{
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [ 'pending', 'accepted', "ongoing", 'completed', 'cancelled' ],
        default: 'pending',
    },

    duration: {
        type: Number,
    }, // in seconds

    distance: {
        type: Number,
    }, // in meters

    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },

    otp: {
        type: String,
        select: false,
        required: true,
    },
    //added for carpool
    isCarpool: {
        type: Boolean,
        default: false
    },
    availableSeats: {
        type: Number,
        default: 1
    },
    waypoints: [{
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    }],
    departureTime: {
        type: Date
    }
});

const rideModel = mongoose.model('ride', rideSchema);

export default rideModel;