const User = require('../models/users');
const { createAccessToken } = require('../middlewares/auth');
const ERRORS = require('../error/errorMessages');
const HttpError = require('../error/httpError');
const { default: axios } = require('axios');

const COOKIE_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

exports.kakaoLogin = async (req, res, next) => {
  const { code } = req.body;

  try {
    const tokenResponse = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code,
        },
      },
    );

    const { access_token: kakaoAccessToken } = tokenResponse.data;

    const userInfoResponse = await axios.get(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const {
      id: kakaoId,
      properties: { nickname },
    } = userInfoResponse.data;

    let user = await User.findOne({ kakaoId });

    if (!user) {
      user = await User.create({ kakaoId, nickname });
    }

    const accessToken = createAccessToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: COOKIE_EXPIRATION_MS,
    });

    res.status(200).json({ result: 'ok' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message,
      );

      return next(new HttpError(400, validationErrors));
    }
    return next(new HttpError(500, ERRORS.PROCESS_ERR));
  }
};

exports.logout = async (req, res, next) => {
  const { kakaoId } = req.body;

  try {
    await axios.post(
      'https://kapi.kakao.com/v1/user/logout',
      { target_id_type: 'user_id', target_id: kakaoId },
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    res.clearCookie('accessToken', { path: '/' });
    res.status(200).json({ result: 'ok' });
  } catch (error) {
    return next(new HttpError(500, ERRORS.PROCESS_ERR));
  }
};
