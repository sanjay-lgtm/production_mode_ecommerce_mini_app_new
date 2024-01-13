import express from "express";
import {
  forgotPasswordController,
  getAllOrdersControllers,
  getOrdersControllers,
  loginController,
  orderStatusController,
  registerController,
  testController,
  updateProfile,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
//router Object
const router = express.Router();
//routing
//Register || POST
router.post("/register", registerController);
//Login || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post('/forgot-password',forgotPasswordController)

//Test Route for checking if server works
router.get("/test", requireSignIn, isAdmin, testController);

//protected user route
router.get("/user-auth",requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected admin route
router.get("/admin-auth",requireSignIn, isAdmin,(req, res) => {
  res.status(200).send({ ok: true });
});

//update Profile

router.put('/profile',requireSignIn,updateProfile);

//order

router.get('/orders',requireSignIn,getOrdersControllers);

//all order

router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersControllers);

//order status update

router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatusController);

export default router;
