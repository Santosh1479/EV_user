const Car = require('../models/car.model');

exports.updateCharge = async (userId, charge) => {
  try {
    const car = await Car.findOneAndUpdate({ userId }, { charge }, { new: true, upsert: true });
    return car;
  } catch (error) {
    console.error('Failed to update charge:', error);
    throw error;
  }
};

exports.getChargeByUserId = async (userId) => {
  try {
    const car = await Car.findOne({ userId });
    if (car) {
      return car.charge;
    } else {
      throw new Error('Car not found');
    }
  } catch (error) {
    console.error('Failed to fetch charge data:', error);
    throw error;
  }
};