import { Server } from 'socket.io';
import userModel from './models/user.model.js';
import captainModel from './models/captain.model.js';
let io;


export function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);
        
        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        });
        socket.on('send_message', async (data) => {
            const { fromId, fromType, toId, toType, message } = data;

            let toSocketId;

            if (toType === 'user') {
                const user = await userModel.findById(toId);
                toSocketId = user?.socketId;
            } else if (toType === 'captain') {
                const captain = await captainModel.findById(toId);
                toSocketId = captain?.socketId;
            }

            if (toSocketId) {
                io.to(toSocketId).emit('receive_message', {
                    fromId,
                    fromType,
                    message
                });
            } else {
                console.log(`Recipient (${toId}) is not connected.`);
            }
        });
        socket.on('send-message', async ({ fromId, toId, message, senderType }) => {
            // Get recipient socketId
            let recipient;
            if (senderType === 'user') {
                recipient = await captainModel.findById(toId);
            } else {
                recipient = await userModel.findById(toId);
            }
        
            const socketId = recipient?.socketId;
            if (socketId) {
                io.to(socketId).emit('receive-message', {
                    fromId,
                    message,
                    senderType
                });
            }
        });
        
        socket.on('new-carpool-ride', (ride) => {
            // Display carpool ride to captain differently
            console.log('New carpool ride available:', ride);
            // You might want to show this differently in the captain app
        });
        
        // Handle passenger joining
        socket.on('passenger-joined', (data) => {
            // Notify captain about new passenger
            console.log('New passenger joined:', data.passenger);
        });
        
        // Handle carpool ride updates
        socket.on('carpool-update', (update) => {
            // Update carpool status for all participants
            console.log('Carpool update:', update);
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}


export const sendMessageToSocketId = (socketId, messageObject) => {

    console.log(messageObject);
    
        if (io) {
            io.to(socketId).emit(messageObject.event, messageObject.data);
        } else {
            console.log('Socket.io not initialized.');
        }
    }  