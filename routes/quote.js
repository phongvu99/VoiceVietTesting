const router = require('express').Router();

const quoteController = require('../controllers/quote');

const {body} = require('express-validator');

const isAuth = require('../middleware/is-auth');

router.post('/quotes', isAuth, [
    body('message').isLength({min: 10}).trim()
], quoteController.createQuote);

router.get('/quotes', isAuth, quoteController.getQuotes);

module.exports = router;