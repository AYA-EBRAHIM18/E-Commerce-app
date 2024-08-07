import { AppError } from "../../utilities/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { User } from "../../../database/models/user.model.js";

const addAddress = catchError(async (req, res, next) => {
  let address = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { addresses: req.body } },
    {
      new: true,
    }
  );
  address || next(new AppError("address Not Found.", 404));
  !address || res.json({ message: "success", address: address.addresses });
});
const removeAddress = catchError(async (req, res, next) => {
  let address = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.id } } },
    {
      new: true,
    }
  );
  address || next(new AppError("address Not Found.", 404));
  !address || res.json({ message: "success", addresses: address.addresses });
});
const getLoggedAddresses = catchError(async (req, res, next) => {
  let addresses = await User.findById(req.user._id);
  addresses || next(new AppError("addresses Not Found.", 404));
  !addresses ||
    res.json({ message: "success", addresses: addresses.addresses });
});
export { addAddress, removeAddress, getLoggedAddresses };
