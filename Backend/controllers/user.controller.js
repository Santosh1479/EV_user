const userModel = require('../models/user.models');
const userservice = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blackListToken.model');
const Car = require('../models/car.model');




module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const hashedpass = await userModel.hashPassword(password);

    const user = await userservice.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedpass
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user })
}

module.exports.loginuser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'invalid Email or Password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'invalid Email or Password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token)

    res.status(200).json({ token, user });
}
exports.getUserData = async (req, res) => {
    try {
        const email = req.user.email;
        const car = await Car.findOne({ email });
        res.status(200).json({ email, charge: car ? car.charge : null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
};

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}


module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: "logged out" });
}