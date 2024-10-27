import db_pool from "../db/db.js";
import { typeEnum, categoryEnum } from "../helpers/enums.js";
import HttpError from "../helpers/HttpError.js";

export const getAllVehicles = async (userId = null) => {
  // Query to fetch all vehicles
  const query = `
    SELECT Vehicles.*, 
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM Vehicles 
    LEFT JOIN LikedBy  ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?`;
  const [vehicles] = await db_pool.execute(query, [userId]);
  return vehicles;
};

export const getAllMyVehicles = async (userId) => {
  // Query to fetch all vehicles
  const query = `
    SELECT Vehicles.*, 
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM Vehicles 
    LEFT JOIN LikedBy  ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?
    WHERE Vehicles.owner_id = ?`;
  const [vehicles] = await db_pool.execute(query, [userId, userId]);
  return vehicles;
};

export const getAllBoats = async (userId = null) => {
  const query = `
    SELECT Vehicles.*, Boats.*,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM Boats
    JOIN Vehicles ON Boats.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?`;
  const [boats] = await db_pool.execute(query, [userId]);
  return boats;
};

export const getAllTrailers = async (userId = null) => {
  const query = `
    SELECT Vehicles.*, Trailers.*,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM Trailers
    JOIN Vehicles ON Trailers.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?`;
  const [vehicles] = await db_pool.execute(query, [userId]);
  return vehicles;
};

export const getAllSailBoats = async (userId = null) => {
  const query = `
    SELECT Vehicles.*, Boats.*, SailBoats.*,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM SailBoats
    JOIN Boats ON SailBoats.boat_id = Boats.id
    JOIN Vehicles ON Boats.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?`;
  const [vehicles] = await db_pool.execute(query, [userId]);
  return vehicles;
};

export const getAllPowerBoats = async (userId = null) => {
  const query = `
    SELECT Vehicles.*, Boats.*, PowerBoats.*,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM PowerBoats
    JOIN Boats ON PowerBoats.boat_id = Boats.id
    JOIN Vehicles ON Boats.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?`;
  const [vehicles] = await db_pool.execute(query, [userId]);
  return vehicles;
};

export const getAllInflatables = async (userId = null) => {
  const query = `
    SELECT Vehicles.*, Boats.*, Inflatable.*,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM Inflatable
    JOIN Boats ON Inflatable.boat_id = Boats.id
    JOIN Vehicles ON Boats.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?`;
  const [vehicles] = await db_pool.execute(query, [userId]);
  return vehicles;
};

export const getAllSmallboats = async (userId = null) => {
  const query = `
    SELECT Vehicles.*, Boats.*, SmallBoats.*,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM SmallBoats
    JOIN Boats ON SmallBoats.boat_id = Boats.id
    JOIN Vehicles ON Boats.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?`;
  const [vehicles] = await db_pool.execute(query, [userId]);
  return vehicles;
};

export const getLikedVehicles = async (userId) => {
  const query = `
    SELECT Vehicles.*
    FROM Vehicles
    JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?`;
  const [vehicles] = await db_pool.execute(query, [userId]);
  return vehicles;
};

// Like a Vehicle
export const likeVehicle = async (userId, vehicleId) => {
  //check if exists
  const checkQuery1 = `SELECT COUNT(*) AS found FROM Vehicles WHERE id = ?`;
  const [check1] = await db_pool.execute(checkQuery1, [vehicleId]);
  if (check1[0].found < 1) {
    throw HttpError(404, `Not Found`);
  }
  //check if already liked
  const checkQuery2 = `SELECT COUNT(*) AS found FROM LikedBy WHERE user_id = ? AND vehicle_id = ?`;
  const [check2] = await db_pool.execute(checkQuery2, [userId, vehicleId]);
  if (check2[0].found > 0) {
    throw HttpError(400, `Already Liked`);
  }

  const query = `INSERT INTO LikedBy (user_id, vehicle_id) VALUES (?, ?)`;
  const [result] = await db_pool.execute(query, [userId, vehicleId]);

  return { message: "Liked successfully", vehicleId };
};

// Remove Like from Vehicle
export const deleteLike = async (userId, vehicleId) => {
  //check if  liked
  const checkQuery = `SELECT COUNT(*) AS found FROM LikedBy WHERE user_id = ? AND vehicle_id = ?`;
  const [check] = await db_pool.execute(checkQuery, [userId, vehicleId]);
  if (check[0].found < 1) {
    throw HttpError(404, `Not Found`);
  }

  const query = `DELETE FROM LikedBy WHERE user_id = ? AND vehicle_id = ?`;
  const [vehicles] = await db_pool.execute(query, [userId, vehicleId]);
  return { message: "Like deleted successfully" };
};

export const getVehicleById = async (userId = null, vehicleId) => {
  const query = `
    SELECT Vehicles.*
    FROM Vehicles
    WHERE Vehicles.id = ?`;
  const [vehicle] = await db_pool.execute(query, [vehicleId]);
  if (vehicle.length === 0) {
    throw HttpError(404, "Not Found");
  }
  switch (vehicle[0].type) {
    case typeEnum.trailer:
      const [trailer] = await getTrailerById(userId, vehicleId);
      return trailer;
    case typeEnum.boat:
      const query2 = `
             SELECT Boats.*
             FROM Boats
             WHERE Boats.vehicle_id = ?`;
      const [boat] = await db_pool.execute(query2, [vehicleId]);
      if (boat.length === 0) {
        throw HttpError(404, "Not Found");
      }
      switch (boat[0].category) {
        case categoryEnum.inflatable:
          const [inflatable] = await getInflatableById(userId, vehicleId);
          return inflatable;

        case categoryEnum.powerboat:
          const [powerboat] = await getPowerBoatById(userId, vehicleId);
          return powerboat;

        case categoryEnum.sailboat:
          const [sailboat] = await getSailBoatById(userId, vehicleId);
          return sailboat;

        case categoryEnum.smallboat:
          const [smallboat] = await getSmallBoatById(userId, vehicleId);
          return smallboat;

        default:
          break;
      }
      break;

    default:
      break;
  }
  throw HttpError(500);
};

export const getTrailerById = async (userId = null, trailerId) => {
  const query = `
    SELECT Vehicles.*, Trailers.*, Vehicles.id,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM Trailers
    JOIN Vehicles ON Trailers.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id  AND LikedBy.user_id = ?
    WHERE Vehicles.id = ?`;
  const [trailer] = await db_pool.execute(query, [userId, trailerId]);
  return trailer;
};

export const getSailBoatById = async (userId = null, boatId) => {
  const query = `
    SELECT Vehicles.*, Boats.*, SailBoats.*, Vehicles.id,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM SailBoats
    JOIN Boats ON SailBoats.boat_id = Boats.id
    JOIN Vehicles ON Boats.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?
    WHERE Vehicles.id = ?`;
  const [boat] = await db_pool.execute(query, [userId, boatId]);
  return boat;
};

export const getPowerBoatById = async (userId = null, boatId) => {
  const query = `
    SELECT Vehicles.*, Boats.*, PowerBoats.*, Vehicles.id,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM PowerBoats
    JOIN Boats ON PowerBoats.boat_id = Boats.id
    JOIN Vehicles ON Boats.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?
    WHERE Vehicles.id = ?`;
  const [boat] = await db_pool.execute(query, [userId, boatId]);
  return boat;
};

export const getInflatableById = async (userId = null, boatId) => {
  const query = `
    SELECT Vehicles.*, Boats.*, Inflatable.*, Vehicles.id,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM Inflatable
    JOIN Boats ON Inflatable.boat_id = Boats.id
    JOIN Vehicles ON Boats.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?
    WHERE Vehicles.id = ?`;
  const [boat] = await db_pool.execute(query, [userId, boatId]);
  return boat;
};

export const getSmallBoatById = async (userId = null, boatId) => {
  const query = `
    SELECT Vehicles.*, Boats.*, SmallBoats.*, Vehicles.id,
    IF(LikedBy.user_id IS NOT NULL, true, false) AS isLiked 
    FROM SmallBoats
    JOIN Boats ON SmallBoats.boat_id = Boats.id
    JOIN Vehicles ON Boats.vehicle_id = Vehicles.id
    LEFT JOIN LikedBy ON Vehicles.id = LikedBy.vehicle_id AND LikedBy.user_id = ?
    WHERE Vehicles.id = ?`;
  const [boat] = await db_pool.execute(query, [userId, boatId]);
  return boat;
};

// Create Trailer Service
export const createTrailer = async (userId, trailerData) => {
  const {
    model,
    material,
    price,
    location,
    year,
    description,
    photo,
    payload,
  } = trailerData;

  const connection = await db_pool.getConnection(); // Get a connection from the pool

  try {
    await connection.beginTransaction(); // Begin transaction

    const [vehicle] = await connection.query(
      `INSERT INTO Vehicles (model, type, material, price, location, year, description, photo, owner_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        model,
        typeEnum.trailer,
        material,
        price,
        location,
        year,
        description,
        photo,
        userId,
      ]
    );

    const vehicleId = vehicle.insertId; // Retrieve the inserted vehicle ID

    await connection.query(
      `INSERT INTO Trailers (vehicle_id, payload) VALUES (?, ?)`,
      [vehicleId, payload]
    );

    await connection.commit(); // Commit the transaction
    const [trailer] = await getTrailerById(userId, vehicleId);

    return trailer;
  } catch (error) {
    await connection.rollback(); // Rollback in case of error
    throw error;
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Create Sailboat Service
export const createSailBoat = async (userId, boatData) => {
  const {
    model,
    material,
    price,
    location,
    year,
    description,
    photo,
    length,
    beam,
    engine,
    power,
    mastHeight,
    sailArea,
    draught,
  } = boatData;

  const connection = await db_pool.getConnection(); // Get a connection from the pool

  try {
    await connection.beginTransaction(); // Begin transaction

    const [vehicle] = await connection.query(
      `INSERT INTO Vehicles (model, type, material, price, location, year, description, photo, owner_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        model,
        typeEnum.boat,
        material,
        price,
        location,
        year,
        description,
        photo,
        userId,
      ]
    );

    const vehicleId = vehicle.insertId; // Retrieve the inserted vehicle ID

    const [newBoat] = await connection.query(
      `INSERT INTO Boats (vehicle_id, category, length, beam, engine, power) VALUES (?, ?, ?, ?, ?, ?)`,
      [vehicleId, categoryEnum.sailboat, length, beam, engine, power]
    );

    const boatsId = newBoat.insertId;

    await connection.query(
      `INSERT INTO SailBoats (boat_id, mastHeight, sailArea, draught) VALUES (?, ?, ?, ?)`,
      [boatsId, mastHeight, sailArea, draught]
    );

    await connection.commit(); // Commit the transaction
    const [boat] = await getSailBoatById(userId, vehicleId);

    return boat;
  } catch (error) {
    await connection.rollback(); // Rollback in case of error
    throw error;
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Create Powerboat Service
export const createPowerBoat = async (userId, boatData) => {
  const {
    model,
    material,
    price,
    location,
    year,
    description,
    photo,
    length,
    beam,
    engine,
    power,
    engineType,
    speed,
  } = boatData;

  const connection = await db_pool.getConnection(); // Get a connection from the pool

  try {
    await connection.beginTransaction(); // Begin transaction

    const [vehicle] = await connection.query(
      `INSERT INTO Vehicles (model, type, material, price, location, year, description, photo, owner_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        model,
        typeEnum.boat,
        material,
        price,
        location,
        year,
        description,
        photo,
        userId,
      ]
    );

    const vehicleId = vehicle.insertId; // Retrieve the inserted vehicle ID

    const [newBoat] = await connection.query(
      `INSERT INTO Boats (vehicle_id, category, length, beam, engine, power) VALUES (?, ?, ?, ?, ?, ?)`,
      [vehicleId, categoryEnum.powerboat, length, beam, engine, power]
    );

    const boatsId = newBoat.insertId;

    await connection.query(
      `INSERT INTO PowerBoats (boat_id,  engineType, speed) VALUES (?, ?, ?)`,
      [boatsId, engineType, speed]
    );

    await connection.commit(); // Commit the transaction
    const [boat] = await getPowerBoatById(userId, vehicleId);

    return boat;
  } catch (error) {
    await connection.rollback(); // Rollback in case of error
    throw error;
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Create Inflatable Service
export const createInflatable = async (userId, boatData) => {
  const {
    model,
    material,
    price,
    location,
    year,
    description,
    photo,
    length,
    beam,
    engine,
    power,
    persons,
  } = boatData;

  const connection = await db_pool.getConnection(); // Get a connection from the pool

  try {
    await connection.beginTransaction(); // Begin transaction

    const [vehicle] = await connection.query(
      `INSERT INTO Vehicles (model, type, material, price, location, year, description, photo, owner_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        model,
        typeEnum.boat,
        material,
        price,
        location,
        year,
        description,
        photo,
        userId,
      ]
    );

    const vehicleId = vehicle.insertId; // Retrieve the inserted vehicle ID

    const [newBoat] = await connection.query(
      `INSERT INTO Boats (vehicle_id, category, length, beam, engine, power) VALUES (?, ?, ?, ?, ?, ?)`,
      [vehicleId, categoryEnum.inflatable, length, beam, engine, power]
    );

    const boatsId = newBoat.insertId;

    await connection.query(
      `INSERT INTO Inflatable (boat_id,  persons) VALUES (?, ?)`,
      [boatsId, persons]
    );

    await connection.commit(); // Commit the transaction
    const [boat] = await getInflatableById(userId, vehicleId);

    return boat;
  } catch (error) {
    await connection.rollback(); // Rollback in case of error
    throw error;
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Create Smallboat Service

export const createSmallboat = async (userId, boatData) => {
  const {
    model,
    material,
    price,
    location,
    year,
    description,
    photo,
    length,
    beam,
    engine,
    power,
  } = boatData;

  const connection = await db_pool.getConnection(); // Get a connection from the pool

  try {
    await connection.beginTransaction(); // Begin transaction

    const [vehicle] = await connection.query(
      `INSERT INTO Vehicles (model, type, material, price, location, year, description, photo, owner_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        model,
        typeEnum.boat,
        material,
        price,
        location,
        year,
        description,
        photo,
        userId,
      ]
    );

    const vehicleId = vehicle.insertId; // Retrieve the inserted vehicle ID

    const [newBoat] = await connection.query(
      `INSERT INTO Boats (vehicle_id, category, length, beam, engine, power) VALUES (?, ?, ?, ?, ?, ?)`,
      [vehicleId, categoryEnum.smallboat, length, beam, engine, power]
    );

    const boatsId = newBoat.insertId;

    await connection.query(`INSERT INTO SmallBoats (boat_id) VALUES (?)`, [
      boatsId,
    ]);

    await connection.commit(); // Commit the transaction
    const [boat] = await getSmallBoatById(userId, vehicleId);

    return boat;
  } catch (error) {
    await connection.rollback(); // Rollback in case of error
    throw error;
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};
