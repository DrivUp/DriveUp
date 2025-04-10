import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDb from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from 'cookie-parser';


dotenv.config();
connectToDb();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));  
app.use('/users', userRoutes);


app.get('/', (req, res) => {
  res.send("Hello World!");
})


export default app;