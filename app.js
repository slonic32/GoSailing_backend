import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

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
app.use(`${pathPrefix}/users`, userRouter);
app.use(`${pathPrefix}/ads`, adsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(globalErrorHandler);

const port = +process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
