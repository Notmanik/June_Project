import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleCreatePost = async () => {
    if (!file || !description) {
      alert("File and description are required");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("tags", tags);
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      alert("You must be logged in to create a post");
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:5000/api/newpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Post created:", res.data);
      setIsLoading(false);
      navigate("/home");
    } catch (err) {
      console.error("Full error:", err.response?.data || err.message);
      setIsLoading(false);
      alert("Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 transition-colors duration-300">
              Create a New Post
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
              Share your moments with the community
            </p>
          </div>
          
          <div className="p-6">
            {/* Upload section */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                previewUrl 
                  ? 'border-indigo-300 bg-indigo-50 dark:bg-gray-800' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700/50'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,video/*"
              />
              
              {previewUrl ? (
                <div className="relative">
                  {file.type.startsWith('image') ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-80 mx-auto rounded-lg object-cover"
                    />
                  ) : (
                    <div className="bg-gray-800 dark:bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
                      <video className="max-h-80 mx-auto">
                        <source src={previewUrl} type={file.type} />
                      </video>
                    </div>
                  )}
                  <div className="mt-4 flex justify-center">
                    <button 
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                    >
                      Change Media
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <svg 
                      className="h-8 w-8 text-indigo-500 dark:text-indigo-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                      />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      <span className="text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                      PNG, JPG, GIF, MP4 up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* File info */}
            {file && (
              <div className="mt-4 bg-indigo-50 dark:bg-gray-700/50 rounded-lg p-4 flex justify-between items-center transition-colors duration-300">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                    {file.type.split('/')[0]} • {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Description
              </label>
              <textarea
                className="w-full h-40 p-4 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                placeholder="What's on your mind? Share your story..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Tags (comma separated)
              </label>
              <input
                type="text"
                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                placeholder="travel, food, adventure"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Add relevant tags to help others discover your post
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                onClick={() => navigate("/home")}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 flex items-center disabled:opacity-70"
                onClick={handleCreatePost}
                disabled={isLoading || !file || !description}
              >
                {isLoading ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                      />
                    </svg>
                    Create Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
          <p>Share your best moments with the community. Remember to be kind and respectful.</p>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;