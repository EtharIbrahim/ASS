const jwt = require('jsonwebtoken');
const config = require('../config/keys');

AuthenticatorJWT = (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        res.status(404).json({ errorMessage: 'No token. Access Denied' });
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded?.user;
        next();
    } catch (error) {
        console.log(error)
    }
}

isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 1) {
        return next();
    } else {
         res.status(401).send({ errorMessage: 'Admin not authorized.' });
    }
}

authUser = (req, res, next) => {
    if (req.user && req.user.role === 0) {
        return next();
    } else {
        return res.status(401).send({ errorMessage: 'Not Allowed' });
    }
}



module.exports = { AuthenticatorJWT, isAdmin, authUser };