import slugify from "slugify";
import { AppError } from "../../utilities/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { Product } from "../../../database/models/product.model.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeatures.js";

const addProduct = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  req.body.imgCover = req.files.imgCover[0].filename;
  req.body.images = req.files.images.map((img) => img.filename);
  let product = new Product(req.body);
  await product.save();
  res.json({ message: "success", product });
});

const getAllProducts = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Product.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();

  let products = await apiFeatures.mongooseQuery;
  if (products.length == 0) next(new AppError("products Not Found.", 404));

  res.json({ message: "success", page: apiFeatures.pageNumber, products });
});
const getProduct = catchError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  product || next(new AppError("product Not Found.", 404));
  !product || res.json({ message: "success", product });
});
const updateProduct = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  if (req.file) req.body.imgCover = req.files.imgCover[0].filename;
  if (req.body.images)
    req.body.images = req.files.images.map((img) => img.filename);
  let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  product || next(new AppError("product Not Found.", 404));
  !product || res.json({ message: "success", product });
});
const deleteProduct = deleteOne(Product);
export { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct };
