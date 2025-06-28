import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getPostByUser,
} from "../controllers/userControllers.js";
import verifyToken from "../middlewares/jwtVerifyToken.js";
import { body, validationResult } from "express-validator";

const router = express.Router();
// Route to get user profile
router.get("/profile", verifyToken, getUserProfile);
// Route to update user profile
router.put(
  "/profile",
  verifyToken,
  [
    body("age").isInt({ min: 13 }).withMessage("Age must be at least 13"),
    body("firstName")
      .isLength({ min: 2 })
      .withMessage("First name is required"),
    body("lastName").isLength({ min: 2 }).withMessage("Last name is required"),
    body("bio")
      .optional()
      .isLength({ max: 200 })
      .withMessage("Bio must be less than 200 characters"),
  ],
  updateUserProfile
);
// Route to delete user account
router.delete("/profile", verifyToken, deleteUserAccount);
router.get("/posts", verifyToken, getPostByUser);
export default router;
