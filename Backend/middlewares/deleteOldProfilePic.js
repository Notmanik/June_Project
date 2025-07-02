import fs from 'fs';
import path from 'path';
import User from '../models/user.js'; // adjust path if different

const deleteOldProfilePic = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId || !req.file) {
      return next(); // nothing to do
    }

    const user = await User.findById(userId);

    if (user?.profilePic?.path) {
      const fullPath = path.join(process.cwd(), user.profilePic.path); // safer than __dirname
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Error deleting old profile picture:", err.message);
        } else {
          console.log("Old profile picture deleted.");
        }
      });
    }

    next();
  } catch (error) {
    console.error("Error in deleteOldProfilePic middleware:", error.message);
    next(); // don't block the update if deletion fails
  }
};

export default deleteOldProfilePic;
