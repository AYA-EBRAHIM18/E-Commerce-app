import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";
import { AppError } from "../../utilities/appError.js";
import { catchError } from "./../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeatures.js";

const addCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.img = req.file.filename;
  let category = new Category(req.body);
  console.log(category);
  await category.save();
  console.log(category);
  res.json({ message: "success", category });
});

const getCategories = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Category.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();

  let categories = await apiFeatures.mongooseQuery;
  if (categories.length == 0) {
    next(new AppError("Categories Not Found.", 404));
  }
  res.json({ message: "success", categories });
});
const getCategory = catchError(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  category || next(new AppError("Category Not Found.", 404));
  !category || res.json({ message: "success", category });
});
const updateCategory = catchError(async (req, res, next) => {
  if (req.body.slug) req.body.slug = slugify(req.body.name);
  if (req.file) req.body.img = req.file.filename;

  let category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  category || next(new AppError("Category Not Found.", 404));
  !category || res.json({ message: "success", category });
});
const deleteCategory = deleteOne(Category);
export {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
