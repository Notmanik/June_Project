import Navbar from "../Components/Navbar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import useDebounce from "../hooks/useDebounce.js"; // Import the custom hook

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFocused, setIsFocused] = useState(false);
  const [popularUsers, setPopularUsers] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  // Debounce search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch popular users on component mount
  useEffect(() => {
    const fetchPopularUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/popularusers"
        );
        if (response.data.success) {
          setPopularUsers(response.data.mockUsers || []);
          console.log(
            "Popular users fetched successfully:",
            response.data.mockUsers
          );
        }
      } catch (err) {
        console.error("Error fetching popular users:", err);
      }
    };

    fetchPopularUsers();

    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Real-time search effect - triggers when debouncedSearchQuery changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim() || debouncedSearchQuery.length < 2) {
        setSearchResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Start both the API call and a delay timer
        const delay = new Promise((resolve) => setTimeout(resolve, 500));
        const apiCall = axios.get(
          `http://localhost:5000/api/user/search/profile?searchQuery=${encodeURIComponent(
            debouncedSearchQuery
          )}`
        );

        // Wait for both to complete
        const [response] = await Promise.all([apiCall, delay]);

        if (response.data.success) {
          setSearchResults(response.data.users);
          setError(null);

          const newSearch = {
            query: debouncedSearchQuery,
            timestamp: new Date().toISOString(),
          };

          const updatedSearches = [
            newSearch,
            ...recentSearches
              .filter((s) => s.query !== debouncedSearchQuery)
              .slice(0, 4),
          ];

          setRecentSearches(updatedSearches);
          localStorage.setItem(
            "recentSearches",
            JSON.stringify(updatedSearches)
          );
        } else {
          setError(response.data.message || "No users found");
          setSearchResults([]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "An error occurred while searching"
        );
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);
  // Dependency on debouncedSearchQuery

  // Keep the manual search for backwards compatibility or Enter key
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Search query cannot be empty");
      return;
    }
    // Force immediate search by updating debouncedSearchQuery manually
    // This is already handled by the useEffect above
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Force immediate search on Enter
      if (searchQuery.trim() && searchQuery.length >= 2) {
        setLoading(true);
        // The useEffect will handle the actual search
      }
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  // Function to get profile pic URL for each user
  const getProfilePicUrl = (user) => {
    if (user.profilePic && user.profilePic.filename) {
      return `http://localhost:5000/uploads/profile-image/${user.profilePic.filename}`;
    }
    return false;
  };

  // Filter by interests - now preserves original search results
  const filteredResults = React.useMemo(() => {
    if (activeFilter === "all") {
      return searchResults;
    }

    return searchResults.filter(
      (user) =>
        user.interests &&
        user.interests.some((interest) =>
          interest.toLowerCase().includes(activeFilter.toLowerCase())
        )
    );
  }, [searchResults, activeFilter]);

  // Popular interests for quick filtering
  const popularInterests = [
    "travel",
    "food",
    "technology",
    "fitness",
    "music",
    "art",
  ];

  // Handle clicking on recent search
  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    // The useEffect will automatically trigger the search
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-950 dark:to-gray-800">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4 dark:text-indigo-500">
            Discover Amazing People
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Connect with people who share your interests and passions
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-8">
          <div
            className={`relative rounded-xl border-2 transition-all ${
              isFocused ? "border-indigo-500" : "border-gray-500"
            }`}
          >
            <div className="flex">
              <input
                type="text"
                placeholder="Search by name, username, or interests... (min 2 characters)"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-6 py-4 rounded-l-xl focus:outline-none text-lg dark:text-gray-200"
              />
              <button
                onClick={handleSearch}
                disabled={loading || searchQuery.length < 2}
                className={`bg-indigo-600 text-white px-8 rounded-r-xl transition-colors flex items-center ${
                  loading || searchQuery.length < 2
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                }`}
              >
                {loading ? (
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
                    Searching...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-time search indicator */}
          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <div className="mt-2 text-sm text-gray-500 dark:focus:text-indigo-400">
              Type at least 2 characters to start searching...
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-4">
              <h3 className="text-gray-700 dark:text-gray-200 mb-2">Recent Searches:</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search.query)}
                    className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors"
                  >
                    {search.query}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem("recentSearches");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 hover:text-red-700 transition-all duration-200 shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Clear Recent Searches</span>
                </button>
              </div>
            </div>
          )}

          {/* Popular Interests */}
          <div className="mt-6">
            <h3 className="text-gray-700 mb-3">Popular Interests:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-500 dark:text-gray-200"
                }`}
              >
                Show All
              </button>
              {popularInterests.map((interest, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFilter(interest)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    activeFilter === interest
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-500 dark:text-gray-200"
                  }`}
                >
                  #{interest}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
  {loading ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 dark:border-indigo-400"></div>
    </div>
  ) : error ? (
    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-800/20 flex items-center justify-center mb-4">
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
      <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
        Search Error
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
      <button
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
        onClick={() => setError(null)}
      >
        Try Again
      </button>
    </div>
  ) : filteredResults.length > 0 ? (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {filteredResults.length}{" "}
          {filteredResults.length === 1 ? "Result" : "Results"} Found
        </h2>
        <div className="text-gray-600 dark:text-gray-400">
          Showing {activeFilter === "all" ? "all" : `#${activeFilter}`}{" "}
          results{" "}
          {debouncedSearchQuery && `for "${debouncedSearchQuery}"`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((user) => (
          <div
            key={user._id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden transition-all hover:shadow-xl dark:hover:shadow-gray-900/70 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                {getProfilePicUrl(user) ? (
                  <img
                    src={getProfilePicUrl(user)}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md"
                    alt={user.username}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-md">
                    <svg
                      className="w-8 h-8 text-gray-400 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4
         -4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4
         v2h16v-2c0-2.66-5.33-4-8-4z"
                      />
                    </svg>
                  </div>
                )}

                <div className="ml-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400">@{user.username}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {user.bio || "No bio available"}
                </p>
              </div>

              {user.interests && user.interests.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {user.interests
                      .slice(0, 3)
                      .map((interest, index) => (
                        <span
                          key={index}
                          className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          #{interest}
                        </span>
                      ))}
                    {user.interests.length > 3 && (
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs">
                        +{user.interests.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                {user.age && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.age} years
                  </div>
                )}
                <div className="flex space-x-3">
                  <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-600 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-full text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : searchQuery && searchQuery.length >= 2 ? (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-12 text-center border border-gray-100 dark:border-gray-700">
      <div className="mx-auto w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-indigo-500 dark:text-indigo-400"
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
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
        No Results Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
        We couldn't find any users matching "{searchQuery}". Try another
        search term or browse popular interests.
      </p>
      <button
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
        onClick={() => {
          setSearchQuery("");
          setActiveFilter("all");
        }}
      >
        Browse All Users
      </button>
    </div>
  ) : (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-12 text-center border border-gray-100 dark:border-gray-700">
      <div className="mx-auto w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-indigo-500 dark:text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
        Start Exploring
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        Search for people by name, username, or interests to discover
        new connections.
      </p>
    </div>
  )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
