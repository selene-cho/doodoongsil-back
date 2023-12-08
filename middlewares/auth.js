const jwt = require('jsonwebtoken');
const HttpError = require('../error/httpError');
const ERRORS = require('../error/errorMessages');

exports.verifyToken = (req, res, next) => {
  const token = req.cookies['accessToken'];

  if (!token) {
    return next(new HttpError(401, ERRORS.AUTH.INVALID_TOKEN));
  }

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return next(new HttpError(401, ERRORS.AUTH.INVALID_TOKEN));
    }

    req.user = user;

    return next();
  });
};

exports.createAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, kakaoId: user.kakaoId, nickname: user.nickname },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1h',
    },
  );
};

exports.createRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, kakaoId: user.kakaoId, nickname: user.nickname },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    },
  );
};
