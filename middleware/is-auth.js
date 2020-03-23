const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // const token = req.get('Authorization');
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        const err = new Error('You must authenticate to access this resource.');
        err.status = 401;
        throw err;
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, Buffer.from(process.env.PRIVATE_KEY, 'base64'), (err, decoded) => {
        if (err) {
            err.status = 500;
            console.log('JWT verify failed!');
            throw err;
        }
        console.log('Decoded Token', decoded);
        req.userID = decoded.userID
        next();
    });
}