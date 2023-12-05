require('dotenv').config();

const express = require('express');

const connectMongoDB = require('./db');
const HttpError = require('./error/httpError');
const ERRORS = require('./error/errorMessages');

const app = express();

app.use(express.json());

connectMongoDB();

app.use((req, res, next) => {
  next(new HttpError(404, ERRORS.NOT_FOUND));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;

  const isDevelopment = req.app.get('env') === 'development';
  res.locals.error = isDevelopment ? err : {};

  res.status(err.status || 500);

  if (
    !isDevelopment &&
    err.status === 500 &&
    err.message === 'Internal Server Error'
  ) {
    res.json({
      result: 'error',
      status: 500,
      message: ERRORS.INTERNAL_SERVER_ERR,
    });
  } else {
    res.json({
      result: 'error',
      status: err.status,
      message: err.message || ERRORS.PROCESS_ERR,
    });
  }
});

app.listen(8000, () => {
  console.log(`Server running at http://localhost:3000`);
});
