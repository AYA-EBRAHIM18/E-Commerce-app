import { Router } from "express";
import {
  addToWishlist,
  getLoggedUserWishlist,
  removeFromWishlist,
} from "./wishlist.controllers.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controllers.js";

const wishlistRouter = Router();
wishlistRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), addToWishlist)
  .get(protectedRoutes, allowedTo("user"), getLoggedUserWishlist);

wishlistRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("user"), removeFromWishlist);
export default wishlistRouter;
