import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "./category.controllers.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { addCategoryVal } from "./category.validation.js";
import { validate } from "../../middleware/validate.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controllers.js";

const categoryRouter = Router();
categoryRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("img", "categories"),
    validate(addCategoryVal),
    addCategory
  )
  .get(getCategories);
categoryRouter
  .route("/:id")
  .get(getCategory)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("img", "categories"),
    updateCategory
  )
  .delete(protectedRoutes, allowedTo("admin"), deleteCategory);

categoryRouter.use("/:categoryId/subCategories", subCategoryRouter);
export default categoryRouter;
