export function errorHandler(err, _req, res, _next) {
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Unexpected server error";

  res.status(statusCode).json({
    status: "error",
    error: {
      code,
      message,
      details: err.details ?? null,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
}
