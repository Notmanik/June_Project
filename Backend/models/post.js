import mongoose from 'mongoose';
import postSchema from '../schemas/post.js'; // Adjust the path as needed

// Compile the model
const Post = mongoose.model('Post', postSchema);
export default Post;
