const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../Errors');


const authenticate = (source = 'header') => {
  return async (req, res, next) => {
    let token;
    
    // for admin reads the httpOnly `accessToken` cookie
    if (source === 'cookie') {
      token = req.cookies?.accessToken;
    } else {
        //for normal users reads `Authorization: Bearer <token>`
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new UnauthenticatedError('Authentication invalid');
    }

    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = {
        userId: payload.userId,
        username: payload.username,
        role: payload.role,
      };
      next();
    } catch (error) {
      throw new UnauthenticatedError('Authentication invalid');
    }
  };
};

module.exports = { authenticate};