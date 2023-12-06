require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectMongoDB = require('./db');
const HttpError = require('./error/httpError');
const ERRORS = require('./error/errorMessages');

const authRouter = require('./routes/authRoutes');
const usersRouter = require('./routes/userRoutes');

const app = express();

connectMongoDB();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

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
