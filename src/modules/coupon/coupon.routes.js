import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controllers.js";
import {
  addCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} from "./coupon.controllers.js";

const couponRouter = Router();
couponRouter.use(protectedRoutes, allowedTo("admin"));
couponRouter.route("/").post(addCoupon).get(getAllCoupons);
couponRouter
  .route("/:id")
  .get(getCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);
export default couponRouter;
