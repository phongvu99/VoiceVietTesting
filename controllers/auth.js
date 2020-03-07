const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Recording = require('../models/Recording');

const getIdentity = async (req, res, next) => {
    try {
        const userID = req.userID;
        const user = await User.findById(userID);
        if (!user) {
            const err = new Error('No user found!');
            err.status = 404;
            throw err;
        }
        res.status(200).json({
            'message': 'Authenticated!',
            'ID': user._id,
            'username': `${user.firstName} ${user.lastName}`
        });
    } catch (err) {
        next(err);
    }
}

const getUser = async (req, res, next) => {
    const userID = req.params.userID;
    if (!userID) {
        const err = new Error('Missing userID parameter!');
        err.status = 422;
        return next(err);
    }
    try {
        const user = await User.findById(userID).select('-password -email');
        if (!user) {
            const err = new Error('No user found!');
            err.status = 404;
            throw err;
        }
        res.status(200).json({
            message: 'User found!',
            user: user._doc
        });
    } catch (err) {
        next(err);
    }
}

const signIn = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            const err = new Error('Invalid email or password!');
            err.status = 401;
            throw err;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const err = new Error('Invalid email or password!');
            err.status = 401;
            throw err;
        }
        const token = jwt.sign({
            email: user.email,
            userID: user._id
        }, Buffer.from(process.env.PRIVATE_KEY, 'base64'), {
            expiresIn: '1h'
        });
        res.status(200).json({
            token: token,
            userID: user._id
        });
    } catch (err) {
        next(err);
    }

}

const signUp = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword
            });
            const userDoc = await user.save();
            res.status(201).json({
                message: 'User created',
                user: userDoc._doc
            });
        } else {
            const err = new Error('Email taken!');
            err.status = 422;
            throw err;
        }
    } catch (err) {
        next(err);
    }

}

module.exports = {
    getUser: getUser,
    getIdentity: getIdentity,
    signUp: signUp,
    signIn: signIn
};