const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    if (
        req.headers.authorization 
        && req.headers.authorization.startsWith('Bearer')
    ) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).send('Access denied!');

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (ex) {
            res.status(401).send('Invalid token! Token can not be validated');
        }
    } else {
      return res.status(400).send('No token provided! Please provide a valid Authorization Token');
    }
}

function requireAdmin(req, res, next) {
    if (!req.user.isAdmin) 
      return res.status(403).send('Forbidden! Only Admin are allowed to perform such operations');

    next();
}

exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
