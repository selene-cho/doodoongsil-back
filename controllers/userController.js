const User = require('../models/users');

const HttpError = require('../error/httpError');
const ERRORS = require('../error/errorMessages');

exports.getUserInfo = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).lean();

    if (!user) {
      return next(new HttpError(404, ERRORS.NOT_FOUND));
    }

    res.status(200).json({ result: 'ok', user });
  } catch (error) {
    return next(new HttpError(500, ERRORS.INTERNAL_SERVER_ERR));
  }
};

exports.updateUserInfo = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return next(new HttpError(404, ERRORS.AUTH.USER_NOT_FOUND));
    }

    res.status(200).json({ result: 'ok' });
  } catch (error) {
    return next(new HttpError(500, ERRORS.INTERNAL_SERVER_ERR));
  }
};
