import Post from "../models/post.js";

import "dotenv/config";
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username profilePic");
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createNewPost = async (req, res) => {
  try {
    const { description, tags } = req.body;
    const media = req.file;
    if (!media) {
      return res
        .status(400)
        .json({ success: false, message: "Media file is required" });
    }

    const userId = req.user.id; // From verifyToken middleware

    // Validate required fields
    if (!description || !media) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Description and media are required",
        });
    }
    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0); 
    const newPost = new Post({
      description,
      media: {
        filename: media.filename,
        path: media.path,
        mimetype: media.mimetype,
      },
      tags: tagsArray,
      user: userId,
    });

    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, media, tags } = req.body;

    // Validate required fields
    if (!description || !media) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Description and media are required",
        });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { description, media, tags },
      { new: true }
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, post: updatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllPosts, createNewPost, editPost, deletePost};
