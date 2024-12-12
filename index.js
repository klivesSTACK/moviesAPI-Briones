//import express library/package
const express = require("express");

//import mongoose connection
const mongoose = require("mongoose");

//import .env
require('dotenv').config();

//Routes Middleware
//const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");

const app = express();
//parses incoming requests with JSON payloads
app.use(express.json());
//reads json object
app.use(express.urlencoded({ extended: true }));

//import cors library/package
const cors = require("cors");

//setup cors
const corsOptions = {

    //client/Frontend application URL
    origin: ['http://localhost:3000', 'https://movies-client-eta.vercel.app'],
    // Allow only specified headers
    credentials: true,
    // Allow only specified HTTP methods
    // optionsSuccessStatus: 200
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);




//setup mongoose database connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};