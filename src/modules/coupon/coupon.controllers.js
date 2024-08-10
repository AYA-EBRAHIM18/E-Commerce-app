import { AppError } from "../../utilities/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeatures.js";
import { Coupon } from "../../../database/models/coupon.model.js";

const addCoupon = catchError(async (req, res, next) => {
  let isExist = await Coupon.findOne({ code: req.body.code });
  if (isExist) return next(new AppError("coupons Already Exists.", 409));
  let coupon = new Coupon(req.body);
  await coupon.save();
  res.json({ message: "success", coupon });
});

const getAllCoupons = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Coupon.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();

  let coupons = await apiFeatures.mongooseQuery;
  if (coupons.length == 0) {
    next(new AppError("coupons Not Found.", 404));
  }
  res.json({ message: "success", coupons });
});
const getCoupon = catchError(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.id);
  coupon || next(new AppError("coupon Not Found.", 404));
  !coupon || res.json({ message: "success", coupon });
});
const updateCoupon = catchError(async (req, res, next) => {
  let coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  coupon || next(new AppError("coupon Not Found.", 404));

  !coupon || res.json({ message: "success", coupon });
});
const deleteCoupon = deleteOne(Coupon);
export { addCoupon, getCoupon, getAllCoupons, updateCoupon, deleteCoupon };
