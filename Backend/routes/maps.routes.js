const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query, body } = require('express-validator');

router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getCoordinates
);

router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getDistanceTime
);

router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getAutoCompleteSuggestions
);

router.get('/get-nearest-locations',
    query('origin').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getNearestLocations
);

router.post('/save-station',
    body('name').isString().isLength({ min: 1 }),
    body('latitude').isFloat(),
    body('longitude').isFloat(),
    body('portsAvailable').isInt(),
    authMiddleware.authUser,
    mapController.saveStation
);

router.get('/get-stations',
    authMiddleware.authUser,
    mapController.getStations
);

router.post('/update-station',
    body('name').isString().isLength({ min: 1 }),
    body('latitude').isFloat(),
    body('longitude').isFloat(),
    body('portsAvailable').isInt(),
    authMiddleware.authUser,
    mapController.updateStation
);

module.exports = router;