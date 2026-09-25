const CustomAPIError = require('./CustomApiError');
const BadRequestError = require('./bad-request');
const UnauthenticatedError = require('./unauthenticatedError');
const NotFoundError = require('./not-found');

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
};