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

const userRouter = Router();
userRouter
  .route("/")
  .post(protectedRoutes, allowedTo("admin"), checkEmail, addUser)
  .get(getAllUsers);
userRouter
  .route("/:id")
  .get(getUser)
  .put(protectedRoutes, allowedTo("admin"), checkEmail, updateUser)
  .delete(protectedRoutes, allowedTo("admin"), deleteUser);
export default userRouter;
