import express from "express";
import mutler from "../middlewares/mutler.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getPostByUser,
  getUserBySearch,
  popularUsers,
} from "../controllers/userControllers.js";
import verifyToken from "../middlewares/jwtVerifyToken.js";
import deleteOldProfilePic from "../middlewares/deleteOldProfilePic.js";
const router = express.Router();

router.get("/search/profile",getUserBySearch);
// Route to get user profile
router.get("/profile", verifyToken, getUserProfile);
// Route to update user profile
router.put(
  "/profile/edit",
  verifyToken, mutler('profilePic','uploads/profile-image/'),
  deleteOldProfilePic,
  updateUserProfile
);
// Route to delete user account
router.delete("/profile", verifyToken, deleteUserAccount);
router.get("/posts", verifyToken, getPostByUser);
router.get("/popularusers", popularUsers);
export default router;
