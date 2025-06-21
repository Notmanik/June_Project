import React, { use, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleCreatePost = async () => {
    if (!file || !description) {
      alert("File and description are required");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("tags", tags); // comma separated string

    try {
      const token = localStorage.getItem("token"); // or from context
      const res = await axios.post("http://localhost:5000/api/newpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Post created:", res.data);
      alert("Post created successfully!");
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
    }
  };

  return (
    <>
      <Navbar />
      <h1>This page is for creating Post only after the user is logged in</h1>
      <h2>Upload your media here</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      {file && (
        <div>
          <p>File Name: {file.name}</p>
          <p>File Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>File Type: {file.type}</p>
        </div>
      )}
      <h2>Write your description here</h2>
      <textarea
        className="w-full h-32 p-2 border border-gray-300 rounded-md"
        placeholder="Write your description here..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <h2>Add tags here</h2>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Add tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleCreatePost} 
      >
        Create Post
      </button>
    </>
  );
};

export default CreatePost;
