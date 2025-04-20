import mongoose from "mongoose";

const carpoolSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ride',
        required: true
    },
    passengers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        pickup: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        fare: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'otp-verified'],
            default: 'pending'
        },
        otp: {
            type: String,
            select: false
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['searching', 'matched', 'ongoing', 'completed', 'cancelled'],
        default: 'searching'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

carpoolSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Carpool = mongoose.model('Carpool', carpoolSchema);

export default Carpool;