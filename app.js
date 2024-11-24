import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { logRequests } from "./middleware/logRequests.js";
import { logErrors } from "./middleware/logErrors.js";
import HttpError from "./helpers/HttpError.js";

import { globalErrorHandler } from "./helpers/globalErrorHandler.js";
import userRouter from "./routes/userRouter.js";
import adsRouter from "./routes/adsRouter.js";

dotenv.config();

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const pathPrefix = "/api";

//logging requests
app.use(logRequests);

app.use(`${pathPrefix}/users`, userRouter);
app.use(`${pathPrefix}/ads`, adsRouter);

app.use((_, res, next) => {
  next(HttpError(404, "Route not found"));
});

//logging errors
app.use(logErrors);
app.use(globalErrorHandler);

const port = +process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
