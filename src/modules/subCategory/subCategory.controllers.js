import slugify from "slugify";
import { AppError } from "../../utilities/appError.js";
import { catchError } from "./../../middleware/catchError.js";
import { SubCategory } from "./../../../database/models/subCategory.model.js";
import { Category } from "../../../database/models/category.model.js";
import { deleteOne, updateOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeatures.js";

const addSubCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  let subCategory = new SubCategory(req.body);
  let category = await Category.findById(req.body.categoryId);
  if (!category) return next(new AppError("CategoryId is not valid."));
  await subCategory.save();
  res.json({ message: "success", subCategory });
});

const getSubCategories = catchError(async (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) filterObj.categoryId = req.params.categoryId;
  let apiFeatures = new ApiFeatures(SubCategory.find(filterObj), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();

  let subCategories = await apiFeatures.mongooseQuery;

  // let subCategories = await SubCategory.find(filterObj);
  if (subCategories.length == 0)
    return next(new AppError("SubCategories Not Found.", 404));
  // console.log(req.params);
  res.json({ message: "success", subCategories });
});
const getSubCategory = catchError(async (req, res, next) => {
  let subCategory = await SubCategory.findById(req.params.id);
  subCategory || next(new AppError("SubCategory Not Found.", 404));
  !subCategory || res.json({ message: "success", subCategory });
});
const updateSubCategory = updateOne(SubCategory);
const deleteSubCategory = deleteOne(SubCategory);

export {
  addSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
