const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');

router.post('/update-charge', carController.updateCharge);
router.get('/charge', carController.getChargeByEmail);

module.exports = router;