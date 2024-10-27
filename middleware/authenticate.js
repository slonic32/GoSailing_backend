import { adsCheckToken, checkToken } from "../services/jwtServices.js";
import db_pool from "../db/db.js";

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1];

    const id = checkToken(token);
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch current user from the database
    const [currentUser] = await db_pool.query(
      "SELECT * FROM Users WHERE id = ?",
      [id]
    );
    const user = currentUser[0];

    if (user && user.token === token) {
      req.user = user; // Attach user to the request object
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
  }
};

export const adsAuthenticate = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1];

    const id = adsCheckToken(token);
    if (!id) {
      req.user = null; // no user found
      next();
      return;
    }

    // Fetch current user from the database
    const [currentUser] = await db_pool.query(
      "SELECT * FROM Users WHERE id = ?",
      [id]
    );
    const user = currentUser[0];

    if (user && user.token === token) {
      req.user = user; // Attach user to the request object
      next();
    } else {
      req.user = null; // no user found
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const authenticateRefresh = async (req, res, next) => {
  try {
    const { refreshtoken } = req.body;

    const id = checkToken(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch current user from the database
    const [currentUser] = await db_pool.query(
      "SELECT * FROM Users WHERE id = ?",
      [id]
    );
    const user = currentUser[0];

    if (user && user.refreshtoken === refreshtoken) {
      req.user = user; // Attach user to the request object
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
  }
};
