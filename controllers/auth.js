const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Recording = require('../models/Recording');

const getUser = async (req, res, next) => {
    const userID = req.params.userID;
    console.log(userID);
    if (!userID) {
        return res.status(422).json({
            message: 'Missing userID param'
        });
    }
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({
                message: 'No user found!'
            });
        }
        res.status(200).json({
            message: 'User found!',
            user: user._doc
        });
    } catch (err) {
        next(err);
    }
}

const signup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        const userDoc = await user.save();
        res.status(201).json({
            message: 'User created',
            userID: userDoc._id
        });
    } catch (err) {
        next(err);
    }

}

module.exports = {
    getUser: getUser,
    signup: signup
};