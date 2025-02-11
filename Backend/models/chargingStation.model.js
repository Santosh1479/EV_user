const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  portsAvailable: { type: Number, required: true }
});

module.exports = mongoose.model('ChargingStation', chargingStationSchema);