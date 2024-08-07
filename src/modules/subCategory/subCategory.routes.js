import { Router } from "express";
import {
  addSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
} from "./subCategory.controllers.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controllers.js";

const subCategoryRouter = Router({ mergeParams: true, caseSensitive: true });
subCategoryRouter
  .route("/")
  .post(protectedRoutes, allowedTo("admin"), addSubCategory)
  .get(getSubCategories);
subCategoryRouter
  .route("/:id")
  .get(getSubCategory)
  .put(protectedRoutes, allowedTo("admin"), updateSubCategory)
  .delete(protectedRoutes, allowedTo("admin"), deleteSubCategory);

export default subCategoryRouter;
