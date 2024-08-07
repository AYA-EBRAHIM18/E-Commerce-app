import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "./product.controllers.js";
import {
  uploadMixOfFiles,
  uploadSingleFile,
} from "../../fileUpload/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controllers.js";

const productRouter = Router();
productRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadMixOfFiles(
      [
        { name: "imgCover", maxCount: 1 },
        { name: "images", maxCount: 10 },
      ],
      "products"
    ),
    addProduct
  )
  .get(getAllProducts);
productRouter
  .route("/:id")
  .get(getProduct)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadMixOfFiles(
      [
        { name: "imgCover", maxCount: 1 },
        { name: "images", maxCount: 10 },
      ],
      "products"
    ),
    updateProduct
  )
  .delete(protectedRoutes, allowedTo("admin"), deleteProduct);
export default productRouter;
