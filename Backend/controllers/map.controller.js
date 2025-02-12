const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');
const ChargingStation = require('../models/chargingStation.model');
const haversine = require('haversine-distance');

module.exports.getNearestLocations = async (req, res, next) => {
    try {
        const { origin } = req.query;
        const [originLat, originLng] = origin.split(',').map(Number);

        console.log(`Origin: ${originLat}, ${originLng}`);

        const stations = await ChargingStation.find();
        const distances = stations.map(station => {
            const distance = haversine(
                { latitude: originLat, longitude: originLng },
                { latitude: station.latitude, longitude: station.longitude }
            ) / 1000; // Convert to kilometers

            console.log(`Station: ${station.name}, Distance: ${distance}`);

            return {
                ...station.toObject(),
                distance: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
            };
        });

        distances.sort((a, b) => a.distance - b.distance);
        res.json(distances);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports.updateStation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, latitude, longitude, portsAvailable } = req.body;

    try {
        const station = await ChargingStation.findOneAndUpdate(
            { name },
            { latitude, longitude, portsAvailable },
            { new: true, upsert: true } // Create the document if it doesn't exist
        );

        res.status(200).json(station);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.getCoordinates = async (req, res, next) => {
    // Implementation here
};

module.exports.getDistanceTime = async (req, res, next) => {
    // Implementation here
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    // Implementation here
};

module.exports.saveStation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, latitude, longitude, portsAvailable } = req.body;

    try {
        const station = new ChargingStation({
            name,
            latitude,
            longitude,
            portsAvailable
        });

        await station.save();
        res.status(201).json(station);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.getStations = async (req, res, next) => {
    try {
        const stations = await ChargingStation.find();
        res.status(200).json(stations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};