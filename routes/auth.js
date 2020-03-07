const router = require('express').Router();

const authController = require('../controllers/auth');

const isAuth = require('../middleware/is-auth');

router.get('/user/:userID', isAuth, authController.getUser);

router.get('/auth/identity', isAuth, authController.getIdentity);

router.post('/signin', authController.signIn);

router.post('/signup', authController.signUp);

module.exports = router;