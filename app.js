// Imports
const express = require('express');
const authRouter = require('./routes/authRoutes');
const app = express();
const cors = require('cors');
const { FRONTEND_URL } = require('./utils/config');
const shortenerRouter = require('./routes/shortnerRoutes');
const cookieParser = require('cookie-parser');

const whiteList = [FRONTEND_URL, 'http://localhost:5173'];

// CORS config
const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

// Use the cors middleware
app.use(cors(corsOptions));

// Middleware to parse request as json
app.use(express.json());

// Use the cookie parser middleware
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/short', shortenerRouter)

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});


// Error handling and other middlewares
app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Internal Server Error' });
});


module.exports = app;