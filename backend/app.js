import express from "express";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';

// custom imports
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import userRoute from './routes/userRoute.js';

// mongoDB connection
import mongoConnect from "./config/mongooseConnection.js";

dotenv.config();

const app = express();

console.log(process.env.FRONTEND_URL);

app.use(cors({
    origin:  'http://localhost:5173', // Only allow this origin (React frontend)
    credentials: true, // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly list allowed HTTP methods
}));

// Middleware to add COOP and COEP headers
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

// MongoDB connection

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing middleware
app.use(cookieParser());

// Custom routes
app.use('/auth', authRoute);
app.use('/post', postRoute);
app.use('/user', userRoute)

app.listen(process.env.PORT || 5001, async () => {
    console.log(`PORT CONNECTED ON ${process.env.PORT}`);
    await mongoConnect();
});
