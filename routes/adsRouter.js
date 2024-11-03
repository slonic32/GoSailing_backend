import express from "express";
import * as controller from "../controllers/adsController.js";
import { adsAuthenticate, authenticate } from "../middleware/authenticate.js";

import { validateBody } from "../middleware/validateBody.js";
import { Schemas } from "../schemas/userSchemas.js";
import { errorHandling } from "../helpers/errorHandlingWrapper.js";

const adsRouter = express.Router();

// Vehicles Routes
//adsRouter.get("/", adsAuthenticate, errorHandling(controller.getAllVehicles));

adsRouter.get("/", adsAuthenticate, errorHandling(controller.searchVehicles));

adsRouter.get("/my", authenticate, errorHandling(controller.getAllMyVehicles));

adsRouter.get(
  "/:id",
  adsAuthenticate,
  errorHandling(controller.getVehicleById)
);

// Boats Routes
adsRouter.get("/boats", adsAuthenticate, errorHandling(controller.getAllBoats));

// Trailers Routes
adsRouter.get(
  "/trailers",
  adsAuthenticate,
  errorHandling(controller.getAllTrailers)
);

adsRouter.post(
  "/trailers",
  authenticate,
  errorHandling(controller.createTrailer)
);

// Sailboats Routes
adsRouter.get(
  "/sailboats",
  adsAuthenticate,
  errorHandling(controller.getAllSailBoats)
);

adsRouter.post(
  "/sailboats",
  authenticate,
  errorHandling(controller.createSailBoat)
);

// Powerboats Routes
adsRouter.get(
  "/powerboats",
  adsAuthenticate,
  errorHandling(controller.getAllPowerBoats)
);

adsRouter.post(
  "/powerboats",
  authenticate,
  errorHandling(controller.createPowerBoat)
);

// Inflatables Routes
adsRouter.get(
  "/inflatables",
  adsAuthenticate,
  errorHandling(controller.getAllInflatables)
);

adsRouter.post(
  "/inflatables",
  authenticate,
  errorHandling(controller.createInflatable)
);

// Smallboats Routes

adsRouter.get(
  "/smallboats",
  adsAuthenticate,
  errorHandling(controller.getAllSmallBoats)
);

adsRouter.post(
  "/smallboats",
  authenticate,
  errorHandling(controller.createSmallboat)
);

// Liked Routes

adsRouter.get(
  "/liked",
  authenticate,
  errorHandling(controller.getLikedVehicles)
);

adsRouter.post(
  "/liked/:id",
  authenticate,
  errorHandling(controller.likeVehicle)
);

adsRouter.delete(
  "/liked/:id",
  authenticate,
  errorHandling(controller.deleteLike)
);

export default adsRouter;
