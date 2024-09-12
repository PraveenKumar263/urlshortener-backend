const express = require('express');
const shortenerController = require('../controllers/shortenerController');
const shortenerRouter = express.Router();
const auth = require('../utils/auth');

// Shorten a URL
shortenerRouter.post('/shorten', auth.verifyToken, shortenerController.shorten);

// Get the original URL by short code
shortenerRouter.get('/shorts/:code', auth.verifyToken, shortenerController.retrieveUrl);

// Get all URLs created by the user
shortenerRouter.get('/urls', auth.verifyToken, shortenerController.getURLs);

// Get click count for a specific day
shortenerRouter.get('/clickCount/day/:day/:month/:year', auth.verifyToken, shortenerController.getClickCountByDay);

// Get click count for a specific month
shortenerRouter.get('/clickCount/month/:month/:year', auth.verifyToken, shortenerController.getClickCountByMonth);

module.exports = shortenerRouter;
