/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Backend Middleware: Error Handler
 * ═══════════════════════════════════════════════════════════════
 *  Middleware centralizado de manejo de errores para Express.
 * ═══════════════════════════════════════════════════════════════
 */

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${status}: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
