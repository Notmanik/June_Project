import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age :{
        type : Number,
        required: true
    },
    profilePic: {
        type: String,
        default: 'default_profile_pic.png'
    },
    bio: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    interests: {
        type: [String],
        default: []
    },
    friends: {
        type: [String],
        default: []
    }
});


// Username, profile pic,bio
// Email
// Mobile Number
// Password
// Intersts
// Friends

export default userSchema;