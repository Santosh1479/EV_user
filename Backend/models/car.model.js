const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  charge: { type: Number, required: true }
});

module.exports = mongoose.model('Car', carSchema);