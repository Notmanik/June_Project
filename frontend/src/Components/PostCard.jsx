// src/Components/PostCard.jsx
import { useState, useEffect } from "react";

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const [postUserProfilePic, setPostUserProfilePic] = useState("");

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
      if (isDisliked) {
        setDislikes(dislikes - 1);
        setIsDisliked(false);
      }
    }
    setIsLiked(!isLiked);
  };

  const handleDislike = () => {
    if (isDisliked) {
      setDislikes(dislikes - 1);
    } else {
      setDislikes(dislikes + 1);
      if (isLiked) {
        setLikes(likes - 1);
        setIsLiked(false);
      }
    }
    setIsDisliked(!isDisliked);
  };

  useEffect(() => {
    if (post.user?.profilePic?.path) {
      setPostUserProfilePic(`http://localhost:5000/uploads/profile-image/${post.user.profilePic.filename}`);
    }
  }, [post.user]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
      {/* Media section */}
      {post.media && (
        <div className="h-60 overflow-hidden">
          <img
            src={`http://localhost:5000/uploads/post-images/${post.media.filename}`}
            alt="Post media"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content section */}
      <div className="p-5">
        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {post.description}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full px-3 py-1 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* User info and timestamp */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-gray-700 mr-2 shadow-md border-2 border-white dark:border-gray-700 transition-transform duration-200 hover:scale-105">
              {postUserProfilePic ? (
                <img
                  src={postUserProfilePic}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-lg">
                  {post.user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                {post.user?.username || "Unknown user"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(post.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(post.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center text-sm ${
                isLiked
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              }`}
            >
              <svg
                className={`w-5 h-5 mr-1 ${
                  isLiked 
                    ? "fill-current text-orange-500" 
                    : "fill-gray-400 dark:fill-gray-500"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z" />
              </svg>
              {likes}
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center text-sm ${
                isDisliked
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              }`}
            >
              <svg
                className={`w-5 h-5 mr-1 ${
                  isDisliked 
                    ? "fill-current text-blue-500" 
                    : "fill-gray-400 dark:fill-gray-500"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 20l-8-8h6V4h4v8h6l-8 8z" />
              </svg>
              {dislikes}
            </button>
          </div>

          <button className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;