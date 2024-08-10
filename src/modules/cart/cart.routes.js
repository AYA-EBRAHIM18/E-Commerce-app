import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controllers.js";
import {
  addToCart,
  applyCoupon,
  clearUserCart,
  getLoggedUserCart,
  removeFromCart,
  updateQuantity,
} from "./cart.controllers.js";

const cartRouter = Router();
cartRouter.use(protectedRoutes, allowedTo("user"));
cartRouter
  .route("/")
  .post(addToCart)
  .get(getLoggedUserCart)
  .delete(clearUserCart);
cartRouter.post("/applyCoupon", applyCoupon);
cartRouter.route("/:id").put(updateQuantity).delete(removeFromCart);
export default cartRouter;
