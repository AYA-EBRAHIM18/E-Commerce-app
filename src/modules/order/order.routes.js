import { Router } from "express";

import { allowedTo, protectedRoutes } from "../auth/auth.controllers.js";
import {
  createCashOrder,
  createCheckoutSession,
  getAllOrders,
} from "./order.controllers.js";

const orderRouter = Router();
orderRouter
  .route("/:id")
  .post(protectedRoutes, allowedTo("user"), createCashOrder);

orderRouter.route("/").get(protectedRoutes, allowedTo("admin"), getAllOrders);
orderRouter.post(
  "/checkout/:id",
  protectedRoutes,
  allowedTo("user"),
  createCheckoutSession
);

export default orderRouter;
