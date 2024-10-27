import * as services from "../services/adsServices.js";

export const getAllVehicles = async (req, res, next) => {
  const userId = req.user ? req.user.id : null; // If user is authenticated, get userId
  const vehicles = await services.getAllVehicles(userId);
  res.status(200).json(vehicles);
};

export const getAllMyVehicles = async (req, res, next) => {
  const vehicles = await services.getAllMyVehicles(req.user.id);
  res.status(200).json(vehicles);
};

export const getAllBoats = async (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  const boats = await services.getAllBoats(userId);
  res.status(200).json(boats);
};

export const getAllTrailers = async (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  const trailers = await services.getAllTrailers(userId);
  res.status(200).json(trailers);
};

export const createTrailer = async (req, res, next) => {
  const newTrailer = await services.createTrailer(req.user.id, req.body);
  res.status(201).json(newTrailer);
};

export const getAllSailBoats = async (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  const sailBoats = await services.getAllSailBoats(userId);
  res.status(200).json(sailBoats);
};

export const createSailBoat = async (req, res, next) => {
  const newTrailer = await services.createSailBoat(req.user.id, req.body);
  res.status(201).json(newTrailer);
};

export const getAllPowerBoats = async (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  const powerBoats = await services.getAllPowerBoats(userId);
  res.status(200).json(powerBoats);
};

export const createPowerBoat = async (req, res, next) => {
  const newTrailer = await services.createPowerBoat(req.user.id, req.body);
  res.status(201).json(newTrailer);
};

export const getAllInflatables = async (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  const inflatables = await services.getAllInflatables(userId);
  res.status(200).json(inflatables);
};

export const createInflatable = async (req, res, next) => {
  const newTrailer = await services.createInflatable(req.user.id, req.body);
  res.status(201).json(newTrailer);
};

export const getAllSmallBoats = async (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  const inflatables = await services.getAllSmallboats(userId);
  res.status(200).json(inflatables);
};

export const createSmallboat = async (req, res, next) => {
  const newTrailer = await services.createSmallboat(req.user.id, req.body);
  res.status(201).json(newTrailer);
};

export const getLikedVehicles = async (req, res, next) => {
  const likedVehicles = await services.getLikedVehicles(req.user.id);
  res.status(200).json(likedVehicles);
};

export const likeVehicle = async (req, res, next) => {
  const likedVehicles = await services.likeVehicle(req.user.id, req.params.id);
  res.status(200).json(likedVehicles);
};

export const deleteLike = async (req, res, next) => {
  const likedVehicles = await services.deleteLike(req.user.id, req.params.id);
  res.status(200).json(likedVehicles);
};

export const getVehicleById = async (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  const trailer = await services.getVehicleById(userId, req.params.id);
  res.status(200).json(trailer);
};
