import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import categoryRouter from "./src/modules/category/category.routes.js";
import { bootstrap } from "./src/modules/bootstrap.js";
import { AppError } from "./src/utilities/appError.js";
import errorHandler from "./src/middleware/globalErrorHandling.js";
import "dotenv/config";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/categories", categoryRouter);
bootstrap(app);
app.use("*", (req, res, next) => {
  next(new AppError(`Route Not Found ${req.originalUrl}`, 404));
});
app.use(errorHandler);
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
