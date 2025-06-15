import mongoose from 'mongoose';
import userSchema from '../schemas/user.js'; 

// Compile the model
const User = mongoose.model('User', userSchema);
export default User;