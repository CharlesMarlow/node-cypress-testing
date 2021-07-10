const router = require('express').Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DataValidation } = require('../dataValidation');

router.post('/register', async (req, res) => {
    // Validate body against schema requirements
    const { error } = DataValidation.registerValidation(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    
    // Check to make sure user doesnt already exist
    const emailExists = await User.findOne({
        email: req.body.email,
    });

    if (emailExists) {
        return res.status(400).send('Conflict- Email already exists');
    }

    // Enctrypt password
    const enctryptedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: enctryptedPassword
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    // Return error if validation fails
    const { error } = DataValidation.loginValidation(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    };

    // Check email exists
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).send('Email not registered');
    };

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.status(401).send('Invalid password');
    };
    // jwt
    const token = jwt.sign({
        id: user._id
    },
    process.env.TOKEN_SECRET);
    res.header('auth-token', token).status(200).send(token);
    res.status(200).send('Logged in');
});

module.exports = router;