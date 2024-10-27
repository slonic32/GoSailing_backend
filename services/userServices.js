import bcrypt from "bcrypt";
import db_pool from "../db/db.js";
import HttpError from "../helpers/HttpError.js";
import { generateTokens } from "./jwtServices.js";

export const registerDataService = async (email, name, phone, password) => {
  // Check if the email is already in use
  const [existingUser] = await db_pool.query(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  );
  if (existingUser.length > 0) {
    throw HttpError(409, "Email in use");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new user
  const [result] = await db_pool.query(
    "INSERT INTO Users (email, name, phone, password) VALUES (?, ?, ?, ?)",
    [email, name, phone, hashedPassword]
  );

  return await generateTokens(result.insertId);
};

export const loginDataService = async (email, password) => {
  // Find the user by email
  const [foundUser] = await db_pool.query(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  );
  if (foundUser.length === 0)
    throw HttpError(401, "Email or password is wrong");

  // Check the password
  const isPasswordMatching = await bcrypt.compare(
    password,
    foundUser[0].password
  );
  if (!isPasswordMatching) throw HttpError(401, "Email or password is wrong");

  return { ...foundUser[0], ...(await generateTokens(foundUser[0].id)) };
};

export const logoutUserDataService = async (currentUser) => {
  // Update the user to nullify tokens
  await db_pool.query(
    "UPDATE Users SET token = NULL, refreshtoken = NULL WHERE id = ?",
    [currentUser.id]
  );
};

export const updateUserUserDataService = async (currentUser, params) => {
  if (!currentUser) throw HttpError(401, "User not found");

  let name = currentUser.name;
  let email = currentUser.email;
  let phone = currentUser.phone;

  if (params?.name) {
    name = params.name;
  }

  if (params?.email) {
    email = params.email;
  }
  if (params?.phone) {
    phone = params.phone;
  }

  // Update the user's details

  const [result] = await db_pool.query(
    "UPDATE Users SET name = ?, email = ?, phone=? WHERE id = ?",
    [name, email, phone, currentUser.id]
  );
  return { id: currentUser.id, name, email, phone }; // Return updated user info
};

export const regenerateTokenDataService = async (currentUser) => {
  if (!currentUser) throw HttpError(401, "User is not found");
  return await generateTokens(currentUser.id);
};

export const safeUserCloneDataService = (user) => {
  const { id, token, refreshtoken, password, ...cloneUser } = user;
  return cloneUser;
};
