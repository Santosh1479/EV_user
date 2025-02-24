const carService = require('../services/car.service');

exports.updateCharge = async (req, res) => {
  try {
    const { userId, charge } = req.body;
    const car = await carService.updateCharge(userId, charge);
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update charge' });
  }
};

exports.getChargeByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    const charge = await carService.getChargeByUserId(userId);
    res.status(200).json({ charge });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch charge data' });
  }
};