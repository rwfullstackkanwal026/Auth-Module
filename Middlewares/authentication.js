const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../Errors');


const authenticate = (source = 'header') => {
  return async (req, res, next) => {
    let token;
    
    // for admin reads the httpOnly `accessToken` cookie
    if (source === 'cookie') {
      token = req.cookies?.accessToken; //? shows if there is no token
    } else {
        //for normal users reads `Authorization: Bearer <token>`
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }

      //const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    }

    if (!token) {
      throw new UnauthenticatedError('Authentication invalid');
    }

    try {
        //decode token
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

// if person accessing the route is not user or admin
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError('Not authorized to access this route');
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles};