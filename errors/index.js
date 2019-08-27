const handle400Errors = (err, req, res, next) => {
  const { status, msg } = err;
  if (status === 400) {
    res.status(status).json({ msg });
  } else {
    next(err);
  }
};

const handle404Errors = (err, req, res, next) => {
  const { status, msg } = err;
  if (status === 404) {
    res.status(status).json({ msg });
  }
};

module.exports = { handle404Errors, handle400Errors };
