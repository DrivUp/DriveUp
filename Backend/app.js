import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDb from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import captainRoutes from "./routes/captain.routes.js"
import cookieParser from 'cookie-parser';
import mapRoutes from "./routes/maps.route.js";
import rideRoutes from "./routes/ride.route.js";
dotenv.config();
connectToDb();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));  
app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/rides', rideRoutes);
app.get('/', (req, res) => {
  res.send("Hello World!");
})


export default app;