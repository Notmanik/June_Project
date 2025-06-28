// src/pages/Home.jsx
import { useEffect, useState } from "react";
import PostCard from "../Components/PostCard";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
// Simulate API call with mock data

const getAllPosts = async () => {
  try {
    // In a real app, you would call your actual API
    const response = await fetch("http://localhost:5000/api/posts");
    if (!response.ok) {
      console.error("Request failed with status:", response.status);
      const errorData = await response.text();
      console.error("Error response:", errorData);
      return [];
    }
    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.error("Network error:", error);
    return [];
  }
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      setLoading(false);
    };
    
    // Simulate loading delay
    setTimeout(() => {
      fetchPosts();
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-3">
            Welcome to Vistara
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create, share, and explore. Vistara is your space to post moments, upload media, and stay connected.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Posts</h2>
              <div className="bg-white rounded-lg shadow-sm px-3 py-1">
                <span className="text-sm text-gray-600">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </span>
              </div>
            </div>
            
            {posts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts available</h3>
                <p className="text-gray-500 mb-4">
                  Be the first to share something with the community!
                </p>
                <Link 
                  to="/home/createpost"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;