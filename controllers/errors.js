const request_404 = (req, res, next) => {
    res.status(418).json({
        'message': "The requested resource was not found.",
        'teapot': "I'm a teapot!"
    });
};

module.exports = {
    request_404 : request_404
};