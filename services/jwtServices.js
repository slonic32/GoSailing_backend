import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import db_pool from "../db/db.js";

export const signToken = (id) =>
  jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "1d",
  });

export const checkToken = (token, secret = process.env.SECRET) => {
  if (!token) throw HttpError(401, "Unauthorized");

  try {
    const { id } = jwt.verify(token, secret);
    return id;
  } catch (error) {
    throw HttpError(401, "Unauthorized");
  }
};

export const adsCheckToken = (token, secret = process.env.SECRET) => {
  if (!token) return null;

  try {
    const { id } = jwt.verify(token, secret);
    return id;
  } catch (error) {
    return null;
  }
};

export const generateTokens = async (user_id) => {
  const payload = { id: user_id };
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: process.env.AUTH_EXPIRATION || "1d",
  });

  const refreshtoken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "30d",
  });

  // Update the user in the MySQL database
  const [result] = await db_pool.query(
    "UPDATE Users SET token = ?, refreshtoken = ? WHERE id = ?",
    [token, refreshtoken, user_id] // Use user.id for the MySQL query
  );

  if (result.affectedRows === 0) {
    throw HttpError(404, "User not found");
  }

  return { token, refreshtoken };
};
