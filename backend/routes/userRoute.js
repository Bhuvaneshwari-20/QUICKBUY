import express from "express";
import {
  registerUser,
  verifyOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  deleteUserAddress,
  getUserOrderHistory,
  reorderFromHistory,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.post("/profile", authMiddleware, getUserProfile);
router.post("/update-profile", authMiddleware, updateUserProfile);
router.post("/add-address", authMiddleware, addUserAddress);
router.post("/delete-address", authMiddleware, deleteUserAddress);
router.post("/order-history", authMiddleware, getUserOrderHistory);
router.post("/reorder", authMiddleware, reorderFromHistory);

export default router;
