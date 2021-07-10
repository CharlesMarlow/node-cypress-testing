const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Setup to read an env var from a file
dotenv.config();

// Connect to mongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false},
    () => console.log('Successfully connected to mongoDB')
);

// Parser middleware
app.use(express.json());

// Route middleware
app.use('/api/user', authRoute);

app.listen(3000, () => {
    console.log('Server is up and running in port 3000');
});