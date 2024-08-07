import slugify from "slugify";
import { AppError } from "../../utilities/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteOne, updateOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeatures.js";
import { Review } from "../../../database/models/review.model.js";

const addReview = catchError(async (req, res, next) => {
  req.body.user = req.user._id;
  let isExist = await Review.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isExist) return next(new AppError("you can only put one review.", 404));
  let review = new Review(req.body);
  await review.save();
  res.json({ message: "success", review });
});

const getAllReviews = catchError(async (req, res, next) => {
  let reviews = await Review.find();
  if (reviews.length == 0) {
    next(new AppError("reviews Not Found.", 404));
  }
  res.json({ message: "success", reviews });
});
const getReview = catchError(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  review || next(new AppError("review Not Found.", 404));
  !review || res.json({ message: "success", review });
});
const updateReview = catchError(async (req, res, next) => {
  let review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      new: true,
    }
  );

  review ||
    next(
      new AppError("review Not Found or you didn't create the review.", 404)
    );

  !review || res.json({ message: "success", review });
});
const deleteReview = deleteOne(Review);
export { addReview, getAllReviews, getReview, updateReview, deleteReview };
