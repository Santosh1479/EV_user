const Car = require('../models/car.model');

exports.updateCharge = async (req, res) => {
  try {
    const { email, charge } = req.body;
    const car = await Car.findOneAndUpdate({ email }, { charge }, { new: true, upsert: true });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update charge' });
  }
};

exports.getChargeByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const car = await Car.findOne({ email });
    if (car) {
      res.status(200).json({ charge: car.charge });
    } else {
      res.status(404).json({ error: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch charge data' });
  }
};