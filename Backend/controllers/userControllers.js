import Post from '../models/post.js';
import User from '../models/user.js';
import 'dotenv/config';
const getUserProfile = async (req , res) => {
    try {
        const userId = req.userId; // Extracted from the token in the middleware
        const user = await User.findById(userId).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
// PUT /profile - Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            age,
            bio,
            mobileNumber,
            interests
        } = req.body;
        const profilePic = req.file;

        const userId = req.user?.id; // safe access

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prepare update object
        const updateData = {};
        
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (typeof age !== 'undefined') updateData.age = age;
        if (typeof bio !== 'undefined') updateData.bio = bio;

        if (profilePic) {
  updateData.profilePic = {
    filename: profilePic.filename,
    path: `uploads/profile-image/${profilePic.filename}`,
    mimetype: profilePic.mimetype
  };
}


        if (mobileNumber) {
            const existingUser = await User.findOne({
                mobileNumber,
                _id: { $ne: userId } // exclude current user
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Mobile number already in use'
                });
            }
            updateData.mobileNumber = mobileNumber;
        }

        if (interests) {
            const interestArray = interests
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
            if (interestArray.length > 0) {
                updateData.interests = interestArray;
            }
        }

        // Update user in DB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);

        // Validation error (e.g. negative age)
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        // Duplicate key error (e.g., mobile number)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        // Generic fallback
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile'
        });
    }
};


// DELETE /profile - Delete user account
const deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Step 1: Delete all posts made by this user
        await Post.deleteMany({ user: req.userId });
        
        // Step 2: Delete the user account
        await User.findByIdAndDelete(req.userId);
        
        res.status(200).json({
            message: 'User and all related posts deleted successfully',
            tokenInvalidated : true
        });
        
    } catch (error) {
        console.error('Error deleting user and posts:', error);
        res.status(500).json({ message: 'Server error during deletion' });
    }
};
const getPostByUser = async (req , res) => {
  try{
    const userId = req.user.id;
    const posts = await Post.find({ user: userId }).populate("user", "username profilePicture");
    if (!posts || posts.length === 0) {
      return res.status(404).json({ success: false, message: "No posts found for this user" });
    }
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export { getUserProfile, updateUserProfile, deleteUserAccount, getPostByUser };
