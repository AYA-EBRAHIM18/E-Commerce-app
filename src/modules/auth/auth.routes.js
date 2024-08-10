import { Router } from "express";

import { checkEmail } from "../../middleware/checkEmail.js";
import {
  changePassword,
  protectedRoutes,
  signIn,
  signUp,
} from "./auth.controllers.js";

const authRouter = Router();
authRouter.post("/signUp", checkEmail, signUp);
authRouter.post("/signIn", signIn);
authRouter.patch("/changePass", changePassword);

export default authRouter;
