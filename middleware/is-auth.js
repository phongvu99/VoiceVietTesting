const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // const token = req.get('Authorization');
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        const err = new Error('You must authenticate to access this resource.');
        err.status = 401;
        throw err;
    }
    let dcToken;
    const token = authHeader.split(' ')[1];
    jwt.verify(token, Buffer.from(process.env.PRIVATE_KEY, 'base64'), (err, decoded) => {
        if (err) {
            err.status = 500;
            throw err;
        }
        console.log('Which one come first?');
        req.userID = decoded.userID
        dcToken = decoded;
        next();
    });
    console.log('Decoded Token', dcToken);
}