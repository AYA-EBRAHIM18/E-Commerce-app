import { AppError } from "../../utilities/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteOne, updateOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeatures.js";
import { User } from "../../../database/models/user.model.js";

const addUser = catchError(async (req, res, next) => {
  let user = new User(req.body);
  await user.save();
  res.json({ message: "success", user });
});

const getAllUsers = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(User.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();

  let users = await apiFeatures.mongooseQuery;
  if (users.length == 0) {
    next(new AppError("users Not Found.", 404));
  }
  res.json({ message: "success", users });
});
const getUser = catchError(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  user || next(new AppError("user Not Found.", 404));
  !user || res.json({ message: "success", user });
});
const updateUser = updateOne(User);
const deleteUser = deleteOne(User);
export { addUser, getAllUsers, getUser, updateUser, deleteUser };
