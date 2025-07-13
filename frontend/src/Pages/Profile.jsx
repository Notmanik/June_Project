import { useState, useEffect } from "react";
import axios from "axios";
import getPostByUser from "../Api/getPostByUser";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { set } from "mongoose";

const PostCard = ({ post }) => {
  const navigate = useNavigate();


  const getProfilePicUrl = (user) => {
    if (!user?.profilePic) return null;
    return typeof user.profilePic === "string"
      ? `http://localhost:5000/uploads/profile-image/${user.profilePic}`
      : `http://localhost:5000/uploads/profile-image/${user.profilePic.filename}`;
  };
  const profilePicUrl = getProfilePicUrl(post.user);
  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer dark:bg-gray-800"
      onClick={() => navigate(`/post/${post._id}`)}
    >
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
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 ">{post.description}</p>

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
            {/* Profile Pic */}
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt={`${post.user?.username || "User"}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 text-lg font-bold">
                    {post.user?.username?.charAt(0) || "U"}
                  </span>
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
      </div>
    </div>
  );
};

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data);
        setProfilePic(res.data.profilePic);
        setLoading(false);
      } catch (err) {
        let errorMessage = "An error occurred";
        if (err.response) {
          errorMessage = `Server Error (${err.response.status}): ${err.response.data?.message || err.message
            }`;
        } else if (err.request) {
          errorMessage =
            "No response from server. Please check your connection.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setPostError("No token found. Please log in.");
          setPostLoading(false);
          return;
        }
        const res = await getPostByUser();
        if (res.success) {
          setPosts(res.posts);
          setPostLoading(false);
        } else {
          setPostError(res.message || "Failed to fetch posts");
          setPostLoading(false);
        }
      } catch (err) {
        let errorMessage = "An error occurred";
        if (err.response) {
          errorMessage = `Server Error (${err.response.status}): ${err.response.data?.message || err.message
            }`;
        } else if (err.request) {
          errorMessage =
            "No response from server. Please check your connection.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
        setPostError(errorMessage);
        setPostLoading(false);
      }
    };
    fetchPosts();
  }, []);
  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 dark:border-indigo-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your profile...</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center dark:bg-gray-800 dark:shadow-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4 dark:bg-red-900/30">
          <svg
            className="w-8 h-8 text-red-500 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">
          Profile Error
        </h2>
        <p className="text-gray-600 mb-6 dark:text-gray-300">{error}</p>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 inline-flex items-center dark:bg-indigo-500 dark:hover:bg-indigo-600"
          onClick={() => navigate("/login")}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Return to Login
        </button>
      </div>
    </div>
  );
}
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 sm:px-6 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-blue-900 dark:to-purple-800 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8 relative">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg dark:bg-slate-800">
                  {!userData?.profilePic ||
                    userData.profilePic === "default_profile_pic.png" ? (
                    <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-5xl text-indigo-600">
                        {userData?.firstName?.charAt(0) || "U"}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={`http://localhost:5000/uploads/profile-image/${userData.profilePic.filename}`}
                      alt={`${userData?.firstName || "User"}'s profile`}
                      className="rounded-full w-full h-full object-cover"
                    />
                  )}
                </div>
                <button
                  className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
                  onClick={() => navigate("/home/profile/edit")}
                >
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userData.firstName} {userData.lastName}
                </h1>
                <p className="text-indigo-100 text-xl mb-4">
                  @{userData.username}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                  <div className="bg-indigo-600 bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454"
                      />
                    </svg>
                    <span className="text-white">{userData.age} years</span>
                  </div>

                  <div className="bg-indigo-600 bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-white">
                      {userData.friends.length} friends
                    </span>
                  </div>

                  <div className="bg-indigo-600 bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <span className="text-white">{posts.length} posts</span>
                  </div>
                </div>

                <div className="max-w-xl">
                  <p className="text-indigo-100 italic">
                    {userData.bio ||
                      "No bio available. Add something about yourself!"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Navigation */}
          <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden dark:bg-gray-800">
            <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden dark:bg-gray-900">
              <div className="flex border-b border-gray-100 dark:border-gray-700">
                <button
                  className={`px-6 py-4 text-sm font-medium transition-all ${activeTab === "posts"
                    ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300"
                    }`}
                  onClick={() => setActiveTab("posts")}
                >
                  Your Posts
                </button>
                <button
                  className={`px-6 py-4 text-sm font-medium transition-all ${activeTab === "info"
                    ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300"
                    }`}
                  onClick={() => setActiveTab("info")}
                >
                  Personal Info
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "posts" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Your Posts
                    </h2>
                    <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-all"
                      onClick={() => navigate("/home/createpost")}
                    >
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create New
                    </button>
                  </div>

                  {postLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : postError ? (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <p className="text-red-500">{postError}</p>
                      <button
                        className="mt-4 text-indigo-600 hover:text-indigo-800"
                        onClick={() => window.location.reload()}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                        <svg
                          className="w-12 h-12 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">
                        No posts yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Share your first post with the community
                      </p>
                      <button
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all"
                        onClick={() => navigate("/home/createpost")}
                      >
                        Create Your First Post
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map((post, userData) => (
                        <PostCard key={post._id} post={post} userData={userData} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "info" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-5">
                      {/* Email */}
                      <div className="flex items-start p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-3 mr-4 flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p className="text-gray-800 dark:text-gray-100 font-medium mt-1">
                            {userData.email}
                          </p>
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="flex items-start p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-3 mr-4 flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Mobile</p>
                          <p className="text-gray-800 dark:text-gray-100 font-medium mt-1">
                            {userData.mobileNumber}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-3 mr-4 flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                          <p className="text-gray-800 dark:text-gray-100 font-medium mt-1">
                            {userData.location || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                      Account Details
                    </h3>
                    <div className="space-y-5">
                      {/* Username */}
                      <div className="flex items-start p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-3 mr-4 flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                          <p className="text-gray-800 dark:text-gray-100 font-medium mt-1">
                            @{userData.username}
                          </p>
                        </div>
                      </div>

                      {/* Member Since */}
                      <div className="flex items-start p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-3 mr-4 flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                          <p className="text-gray-800 dark:text-gray-100 font-medium mt-1">
                            {new Date(userData.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>

          {/* Profile Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">
              Profile Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Edit Profile Button */}
              <button
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group"
                onClick={() => navigate("/home/profile/edit")}
              >
                <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                  <svg
                    className="w-7 h-7 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Edit Profile
                </span>
              </button>

              {/* View Friends Button */}
              <button
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group"
                onClick={() => navigate("/home/friends")}
              >
                <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                  <svg
                    className="w-7 h-7 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  View Friends
                </span>
              </button>

              {/* Account Settings Button */}
              <button
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group"
                onClick={() => navigate("/home/settings")}
              >
                <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                  <svg
                    className="w-7 h-7 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Account Settings
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
