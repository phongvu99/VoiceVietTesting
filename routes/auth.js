const router = require('express').Router();

const authController = require('../controllers/auth');

router.get('/user/:userID', authController.getUser);

router.post('/signup', authController.signup);

module.exports = router;