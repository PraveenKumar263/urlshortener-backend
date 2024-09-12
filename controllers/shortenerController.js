const URL = require('../models/url');
const Log = require('../models/log');
const { FRONTEND_LINK } = require('../utils/config');

const shortenerController = {
    shorten: async (req, res) => {
        try {
            const { originalUrl } = req.body;
            const { userId } = req;

            // Check if the URL exists
            const url = await URL.findOne({ originalUrl });
            if (url) {
                return res.status(200).json({
                    shortUrl: `${FRONTEND_LINK}/shorts/${url.shortenerCode}`,
                });
            }

            // Generate a short code
            const lastUrl = await URL.findOne().sort({ shortenerCode: -1 });
            const shortenerCode = lastUrl ? Number(lastUrl.shortenerCode) + 1 : 1;
            const shortUrl = `${FRONTEND_LINK}/shorts/${shortenerCode}`;

            // Save the new URL
            url = new URL({ originalUrl, shortenerCode, createdBy: userId });
            await url.save();

            return res.status(200).json({ shortUrl });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    retrieveUrl: async (req, res) => {
        try {
            const { code } = req.params;

            // Find the URL by short code
            const url = await URL.findOne({ shortenerCode: code });
            if (!url) {
                return res.status(400).json({ message: 'URL not found' });
            }

            // Log the click event with the current timestamp
            const newLog = new Log({
                userId: url.createdBy,
                shortenerCode: code,
                clickedAt: new Date(),
            });
            await newLog.save();

            // Redirect to the original URL
            return res.redirect(301, url.originalUrl);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    getURLs: async (req, res) => {
        try {
            const { userId } = req;

            // Fetch urls
            const urls = await URL.find(
                { createdBy: userId }, 
                { shortenerCode: 1, _id: 0 }
            );

            return res.status(200).json(urls);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    getClickCountByDay: async (req, res) => {
        try {
            const { day, month, year } = req.params;
            const { userId } = req;

            const startOfDay = new Date(year, month - 1, day);
            const endOfDay = new Date(year, month - 1, day + 1);

            const results = await Log.aggregate([
                {
                    $match: {
                        userId,
                        clickedAt: {
                            $gte: startOfDay,
                            $lt: endOfDay
                        }
                    }
                },
                {
                    $group: {
                        _id: "$shortenerCode",
                        count: { $sum: 1 }
                    }
                }
            ]);

            return res.status(200).json({ results });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    getClickCountByMonth: async (req, res) => {
        try {
            const { month, year } = req.params;
            const { userId } = req;

            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 1);

            const results = await Log.aggregate([
                {
                    $match: {
                        userId,
                        clickedAt: {
                            $gte: startOfMonth,
                            $lt: endOfMonth
                        }
                    }
                },
                {
                    $group: {
                        _id: "$shortenerCode",
                        count: { $sum: 1 }
                    }
                }
            ]);

            return res.status(200).json({ results });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
};

module.exports = shortenerController;
