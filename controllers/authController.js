const User = require('../models/users');
const ERRORS = require('../error/errorMessages');
const { createAccessToken } = require('../middlewares/auth');

exports.login = async (req, res, next) => {
  const { kakaoId, nickname } = req.body;
  console.log('req.body', req.body);

  try {
    let user = await User.findOne({ kakaoId });
    console.log('user', user);

    if (!user) {
      user = await User.create({ kakaoId, nickname });
    }

    const accessToken = createAccessToken(user);

    res.status(200).json({ result: 'ok', accessToken });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(
        (err) => err.message,
      );

      return next(new HttpError(400, validationErrors));
    }
    return next(new HttpError(500, ERRORS.PROCESS_ERR));
  }
};
