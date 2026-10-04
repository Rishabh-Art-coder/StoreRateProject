// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
  console.error(err);
  const status = Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({
    error: status === 500 ? "Server error" : err.message,
  });
};
