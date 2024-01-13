import userModals from "../modals/userModals.js";
import orderModals from "../modals/orderModals.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }
    if (!phone) {
      return res.status(400).json({ message: "phone is required" });
    }
    if (!address) {
      return res.status(400).json({ message: "address is required" });
    }
    if (!answer) {
      return res.status(400).json({ message: "answer is required" });
    }

    const existinguser = await userModals.findOne({ email });

    if (existinguser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please Login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModals({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await userModals.findOne({ email });
    if (!user) {
      return res.status(403).send({
        success: false,
        message: "Email is not register",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(403).send({
        success: false,
        message: "Incorrect Password",
      });
    }
    // create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfull",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  res.send("Protected Route");
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModals.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModals.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModals.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updateUser = await userModals.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Upadted Successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Update Profile",
      error,
    });
  }
};

///get order

export const getOrdersControllers = async (req, res) => {
  try {
    const orders = await orderModals
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while get order",
      error,
    });
  }
};

///get all order

export const getAllOrdersControllers = async (req, res) => {
  try {
    const orders = await orderModals
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while get order",
      error,
    });
  }
};

////order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModals.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while get order status",
      error,
    });
  }
};
