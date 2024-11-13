const Log = require("../Model/Log");

const loggerMiddleware = async (req, res, next) => {
  const { method, originalUrl, body } = req;
  const startTime = Date.now();
  res.on("finish", async () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      method,
      endpoint: originalUrl,
      statusCode: res.statusCode,
      message: res.statusCode < 400 ? "Request successful" : "Error occurred",
      error: res.locals.errorMessage || null,
      requestBody: body,
    };
    try {
      await Log.create(logEntry);
      console.log(
        `[${new Date().toISOString()}] ${method} ${originalUrl} - ${
          res.statusCode
        } (${duration}ms)`
      );
    } catch (error) {
      console.error("Error logging request: ", error);
    }
  });
  next();
};

// Error handler to catch errors and log them
const errorLogger = (err, req, res, next) => {
  res.locals.errorMessage = err.message;
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
  next(err);
};

module.exports = { loggerMiddleware, errorLogger };
