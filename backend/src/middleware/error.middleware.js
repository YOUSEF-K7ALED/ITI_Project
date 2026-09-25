// Global error handling middleware
// - Signature: (err, req, res, next)
// - Log the error (console.error / logger)
// - Send a JSON response: { success: false, message: err.message }
// - Use an appropriate status code (err.statusCode || 500)
//
// Also export a "notFound" middleware for unmatched routes (404)



exports.notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
}

exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server Error'});
};