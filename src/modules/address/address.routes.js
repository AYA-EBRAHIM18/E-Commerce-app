import { Router } from "express";

import { allowedTo, protectedRoutes } from "../auth/auth.controllers.js";
import {
  addAddress,
  getLoggedAddresses,
  removeAddress,
} from "./address.controllers.js";
const addressRouter = Router();
addressRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), addAddress)
  .get(protectedRoutes, allowedTo("user"), getLoggedAddresses);

addressRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("user"), removeAddress);
export default addressRouter;
