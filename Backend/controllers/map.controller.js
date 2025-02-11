const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');
const ChargingStation = require('../models/chargingStation.model');
const haversine = require('haversine-distance');

module.exports.getNearestLocations = async (req, res, next) => {
    try {
        const { origin } = req.query;
        const [originLat, originLng] = origin.split(',').map(Number);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log('Fetching stations from DB...');
        const stations = await ChargingStation.find();
        console.log('Stations fetched:', stations);

        const userLocation = { latitude: originLat, longitude: originLng };

        const nearestLocations = stations.map(station => {
            const stationLocation = { latitude: station.latitude, longitude: station.longitude };
            const distance = haversine(userLocation, stationLocation) / 1000; // Convert to kilometers
            return { ...station.toObject(), distance };
        }).sort((a, b) => a.distance - b.distance);

        console.log('Nearest locations:', nearestLocations);
        res.status(200).json(nearestLocations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
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