import slugify from "slugify";
import { AppError } from "../../utilities/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { Brand } from "../../../database/models/brand.model.js";
import { deleteOne, updateOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeatures.js";

const addBrand = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.logo = req.file.filename;
  let brand = new Brand(req.body);
  await brand.save();
  res.json({ message: "success", brand });
});

const getAllBrands = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();

  let brands = await apiFeatures.mongooseQuery;
  if (brands.length == 0) {
    next(new AppError("brands Not Found.", 404));
  }
  res.json({ message: "success", brands });
});
const getBrand = catchError(async (req, res, next) => {
  let brand = await Brand.findById(req.params.id);
  brand || next(new AppError("brand Not Found.", 404));
  !brand || res.json({ message: "success", brand });
});
const updateBrand = updateOne(Brand);
const deleteBrand = deleteOne(Brand);
export { addBrand, getAllBrands, getBrand, updateBrand, deleteBrand };
