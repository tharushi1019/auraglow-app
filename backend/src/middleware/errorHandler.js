// Catches any error passed via next(err) and returns a consistent JSON shape.
function errorHandler(err, req, res, next) {
  console.error('[error]', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Something went wrong on the server.',
  });
}

module.exports = errorHandler;
