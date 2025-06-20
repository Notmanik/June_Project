// src/components/PostCard.jsx

const PostCard = ({ post }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-6 transition-all hover:shadow-lg">
      {/* Media section */}
      {post.media && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.media} 
            alt="Post media" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content section */}
      <div className="p-6">
        {/* Description */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {post.description}
        </h2>
        
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* User info */}
        <div className="flex items-center mb-4">
          <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-2">
            <span className="text-gray-600 text-sm">
              {post.user?.username?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
          <p className="text-gray-600">
            {post.user?.username || "Unknown user"}
          </p>
        </div>
        
        {/* Stats and timestamp */}
        <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
          <div className="flex space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {post.likes}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 13H9m7-9V4M9 13h6" />
              </svg>
              {post.dislikes}
            </span>
          </div>
          <span>
            {new Date(post.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
