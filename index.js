import express from "express";
import "dotenv/config";
import { dbConnection } from "./database/dbConnection.js";
import categoryRouter from "./src/modules/category/category.routes.js";
import { bootstrap } from "./src/modules/bootstrap.js";
import { AppError } from "./src/utilities/appError.js";
import errorHandler from "./src/middleware/globalErrorHandling.js";
import cors from "cors";
import { catchError } from "./src/middleware/catchError.js";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51PltAMJs7opwPS1443BNZCwPJgwtSJUf3eC63eyKV3sY1wHIwCXvd7uK5COGR0nYvz65hJpUndUIsODtD09f8A8D00YQAv6pXj"
);
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

//Before the express.json body parser
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  catchError(async (req, res, next) => {
    const sig = req.headers["stripe-signature"].toString();

    let event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SIGNING_SECRET
    );
    let checkout;
    if (event.type == "checkout.session.completed") {
      checkout = event.data.object;
    }

    // Return a 200 res to acknowledge receipt of the event
    res.json({ message: "success", checkout });
  })
);

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
