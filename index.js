// Imports
const mongoose = require('mongoose');
const { MONGODB_URI, PORT } = require('./utils/config');
const app = require('./app');

// Start mongoose db connection
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to db");
        app.listen(PORT, ()=> {
            console.log(`Server running on port: ${PORT}`);
        })
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB', error);
    });
