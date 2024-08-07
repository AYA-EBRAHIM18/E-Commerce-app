import { AppError } from "../../utilities/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { User } from "../../../database/models/user.model.js";

const addToWishlist = catchError(async (req, res, next) => {
  let wishlist = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.body.product } },
    {
      new: true,
    }
  );
  wishlist || next(new AppError("wishlist Not Found.", 404));
  !wishlist || res.json({ message: "success", wishlist: wishlist.wishlist });
});
const removeFromWishlist = catchError(async (req, res, next) => {
  let wishlist = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.id } },
    {
      new: true,
    }
  );
  wishlist || next(new AppError("wishlist Not Found.", 404));
  !wishlist || res.json({ message: "success", wishlist: wishlist.wishlist });
});
const getLoggedUserWishlist = catchError(async (req, res, next) => {
  let wishlist = await User.findById(req.user._id).populate("wishlist");
  wishlist || next(new AppError("wishlist Not Found.", 404));
  !wishlist || res.json({ message: "success", wishlist: wishlist.wishlist });
});
export { addToWishlist, removeFromWishlist, getLoggedUserWishlist };
