const express = require('express');
const router = express.Router();

const { authenticate, authorizeRoles } = require('../Middlewares/authentication');
const { logout } = require('../Controllers/authenticationController');

// every route below requires a valid admin cookie AND role === 'admin'
router.use(authenticate('cookie'), authorizeRoles('admin'));

router.post('/logout', logout);

router.get('/dashboard', (req, res) => {
  res.status(200).json({ message: `Welcome, admin ${req.user.username}` });
});

module.exports = router;