import { Router } from "express";

import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "./user.controllers.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controllers.js";
import { getUserOrders } from "../order/order.controllers.js";

const userRouter = Router();
userRouter.route("/").post(checkEmail, addUser).get(getAllUsers);
userRouter
  .route("/:id")
  .get(getUser)
  .put(protectedRoutes, allowedTo("admin"), checkEmail, updateUser)
  .delete(protectedRoutes, allowedTo("admin"), deleteUser);
userRouter.get(
  "/:id/orders",
  protectedRoutes,
  allowedTo("user", "admin"),
  getUserOrders
);
export default userRouter;
