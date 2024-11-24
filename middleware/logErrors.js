import db_pool from "../db/db.js";

export const logErrors = async (error, req, res, next) => {
  try {
    const { ip, method, url } = req;
    const errorMessage = error.message;

    const query = `
      INSERT INTO ErrorLogs (ip_address, url_accessed, method, error_message)
      VALUES (?, ?, ?, ?)
    `;
    await db_pool.query(query, [ip, url, method, errorMessage]);

    next(error);
  } catch (loggingError) {
    next(loggingError);
  }
};
