import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  braintreeTokenController,
  braintreepaymentsContrller,
  createProductController,
  deleteProductController,
  getCategorywiseProductController,
  getProductController,
  getSimilarProducts,
  getSingleProductController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  searchProductController,
  updateProductController,
} from "../controller/productsController.js";
import formidable from "express-formidable";
const router = express.Router();

router.post(
  "/product-create",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);
//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", getSimilarProducts);

//category wise product
router.get("/product-category/:slug", getCategorywiseProductController);

//payment route
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, braintreepaymentsContrller);

export default router;
