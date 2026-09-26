

const User = require('../Models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../Errors');

// Admin action #1 — see every registered user
const getAllUsers = async (req, res) => {
  const users = await User.find({}); // password/refreshToken excluded automatically (select:false in schema)
  res.status(StatusCodes.OK).json({ count: users.length, users });
};

// Admin action #2 — promote or demote a user's role
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    throw new BadRequestError('Role must be either "user" or "admin"');
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });

  if (!user) {
    throw new NotFoundError(`No user found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ message: 'User role updated', user });
};

module.exports = { getAllUsers, updateUserRole };