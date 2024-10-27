import express from "express";
import {
  authenticate,
  authenticateRefresh,
} from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validateBody.js";
import { Schemas } from "../schemas/userSchemas.js";
import { errorHandling } from "../helpers/errorHandlingWrapper.js";
import * as controllers from "../controllers/userController.js";

const userRouter = express.Router();
userRouter
  .post(
    "/register",
    validateBody(Schemas.registerSchema),
    errorHandling(controllers.register)
  )
  .post(
    "/login",
    validateBody(Schemas.loginSchema),
    errorHandling(controllers.login)
  )
  .get("/logout", authenticate, errorHandling(controllers.logout))
  .get("/current", authenticate, errorHandling(controllers.current))
  .patch("/update", authenticate, errorHandling(controllers.updateUser))
  .patch(
    "/refresh",
    authenticateRefresh,
    validateBody(Schemas.refreshSchema),
    errorHandling(controllers.refreshTokens)
  );

export default userRouter;
