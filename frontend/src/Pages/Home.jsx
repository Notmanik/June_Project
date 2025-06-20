import { useEffect, useState } from "react";
import PostCard from "../Components/PostCard";
import Navbar from "../Components/Navbar";
const getAllPosts = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/posts");
    if (!response.ok) {
      // Add detailed error logging
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
    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;

  return (
      <>
    <Navbar />
    <h1 className="">This is the home page of my app</h1>
    <p className="">Here all the posts will be available from my users</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      )}
    </div>
  </>
  );
};

export default Home;
