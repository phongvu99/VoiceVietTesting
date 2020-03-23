const Quote = require('../models/Quote');

const createQuote = async (req, res, next) => {
    const message = req.body.message;
    if (!message) {
        const err = new Error('Empty quote!');
        err.status = 422;
        next(err);
    }
    if (message.length < 10) {
        const err = new Error('Quote too short! (Min:10)');
        err.status = 422;
        next(err);
    }
    try {
        const quote = new Quote({
            message: message
        });
        await quote.save();
        res.status(201).json({
            message: 'Quote created!',
            quote: quote._doc
        });
    } catch (err) {

    }
};

const getQuotes = async (req, res, next) => {
    const perPage = parseInt(req.query.per_page) || 50;
    const currentPage = parseInt(req.query.page) || 1;
    if (perPage > 100) {
        perPage = 100;
    }
    if (perPage < 1) {
        perPage = 50;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
    console.log('Per Page', perPage);
    console.log('Current Page', currentPage);
    try {
        const totalItems = await Quote.estimatedDocumentCount();
        const quotes = await Quote.find().sort({
                createdAt: -1
            })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        res.status(200).json({
            message: 'All quotes',
            quotes: quotes,
            totalItems: totalItems
        });
    } catch (err) {
        next(err);
    }
}


module.exports = {
    createQuote: createQuote,
    getQuotes: getQuotes
};