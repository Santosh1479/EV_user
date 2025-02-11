const ChargingStation = require('../models/chargingStation.model');
module.exports.saveStation = async (name, latitude, longitude, portsAvailable) => {
    const station = new ChargingStation({
        name,
        latitude,
        longitude,
        portsAvailable
    });

    try {
        await station.save();
    } catch (err) {
        console.error(err);
        throw err;
    }
    return station;
}