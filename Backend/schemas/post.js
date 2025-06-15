import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})


// Username
// First Name
// Last Name
// age
// Description
// Media
// likes
// dislikes
// Tags
// timestamp

export default postSchema;