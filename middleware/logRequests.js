import db_pool from "../db/db.js";

export const logRequests = async (req, res, next) => {
  try {
    const { ip, method, url } = req;
    const userAgent = req.headers["user-agent"];

    const query = `
      INSERT INTO RequestLogs (ip_address, url_accessed, method, user_agent)
      VALUES (?, ?, ?, ?)
    `;
    await db_pool.execute(query, [ip, url, method, userAgent]);

    next();
  } catch (error) {
    next(error);
  }
};
