// src/Components/Navbar.jsx
import { jwtDecode } from "jwt-decode";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import getUserProfile from "../Api/getUserProfile";
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const token = sessionStorage.getItem("token");
  const [username, setUsername] = useState("");
  const dropdownRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        if (data?.profilePic?.filename) {
          setProfilePic(`http://localhost:5000/${data.profilePic.path}`);
        }
        setUsername(data.username || ""); // Or use a state like setUsername(data.username)
      } catch (err) {
        console.error("Error fetching user profile:", err.message);
      }
    };
    fetchProfile();
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enhanced nav items with descriptions
  const navItems = [
    {
      path: "/home",
      label: "Home",
      description: "Dashboard",
      icon: (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: "/home/profile",
      label: "Profile",
      description: "Your Account",
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      path: "/home/explore",
      label: "Explore",
      description: "Discover",
      icon: (
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
  ];

  // Check if current path matches nav item
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsDropdownOpen(false);
    window.location.reload();
  };

  return token ? (
    <div
      className={`bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg transition-all duration-300 sticky top-0 z-50 ${
        isScrolled ? "shadow-xl backdrop-blur-sm bg-opacity-95" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group cursor-pointer">
              <Link to="/home" className="flex items-center">
              <div className="bg-white rounded-lg p-1 shadow-md group-hover:shadow-lg transition-shadow duration-200">
                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 w-8 h-8 rounded flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
              </div>
              </Link>
              <span className="ml-3 text-white text-xl font-bold tracking-wide">
                <Link to="/home">Vistara
                </Link>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center ${
                    isActive(item.path)
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      : "text-indigo-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="mr-2 transform group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="relative">
                    {item.label}
                    {isActive(item.path) && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                    )}
                  </span>
                </Link>
              ))}

              {/* Enhanced Create Post Button */}
              <Link
                to="/home/createpost"
                className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center ml-2 ${
                  isActive("/home/createpost")
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                    : "text-indigo-200 hover:text-white hover:bg-white/10 hover:shadow-md"
                }`}
              >
                <div className="bg-white/20 rounded-lg p-1 mr-2 group-hover:bg-white/30 transition-colors duration-200">
                  <svg
                    className="w-4 h-4"
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
                </div>
                <span className="relative">
                  Create Post
                  {isActive("/home/createpost") && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                  )}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-indigo-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Enhanced User section */}
          <div className="hidden md:flex items-center">
            <div className="ml-3 relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-white hover:bg-white/10 rounded-xl px-3 py-2 transition-all duration-200 group"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md transition-transform duration-200 hover:scale-105"
                  />

                ) : (
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                    {username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="ml-3 text-left">
                  <div className="text-sm font-medium">{username}</div>
                  <div className="text-xs text-indigo-200">Online</div>
                </div>
                <svg
                  className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Enhanced Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center ">
                      {profilePic ? (
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                          {username?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {username}
                        </div>
                        <div className="text-xs text-gray-500">
                          <Link to = "/home/profile" className="hover:text-blue-400">View Profile</Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/home/settings"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                    Settings
                  </Link>

                  <Link
                    to="/home/help"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Help & Support
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-indigo-500 bg-indigo-700/30 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-white/20 text-white"
                      : "text-indigo-200 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    <div>
                      <div>{item.label}</div>
                      <div className="text-xs text-indigo-300">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              <Link
                to="/home/createpost"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive("/home/createpost")
                    ? "bg-white/20 text-white"
                    : "text-indigo-200 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-lg p-1 mr-3">
                    <svg
                      className="w-4 h-4"
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
                  </div>
                  <div>
                    <div>Create Post</div>
                    <div className="text-xs text-indigo-300">
                      Share your thoughts
                    </div>
                  </div>
                </div>
              </Link>

              <div className="border-t border-indigo-500/50 mt-4 pt-4">
                <div className="flex items-center px-3 py-2 mb-2">
                  <div className="bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-indigo-800 font-bold text-sm">
                      {username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-white text-sm font-medium">
                      {username}
                    </div>
                    <div className="text-indigo-300 text-xs">Online</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-200 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <nav
      className={`bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg transition-all duration-300 sticky top-0 z-50 ${
        isScrolled ? "shadow-xl backdrop-blur-sm bg-opacity-95" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group cursor-pointer">
              <div className="bg-white rounded-lg p-1 shadow-md group-hover:shadow-lg transition-shadow duration-200">
                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 w-8 h-8 rounded flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
              </div>
              <span className="ml-3 text-white text-xl font-bold tracking-wide">
                Vistara
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/SignUp"
              className="text-indigo-200 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10"
            >
              Sign Up
            </Link>
            <Link
              to="/LogIn"
              className="bg-white/90 hover:bg-white text-indigo-600 hover:text-indigo-700 font-medium py-2 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </nav>
  );
};

export default Navbar;
