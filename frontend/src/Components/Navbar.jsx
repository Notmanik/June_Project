// src/Components/Navbar.jsx
import { jwtDecode } from 'jwt-decode';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  let username = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  // Nav items for authenticated users
  const navItems = [
    { path: "/home", label: "Home", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ) },
    { path: "/home/profile", label: "Profile", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ) },
  ];

  // Check if current path matches nav item
  const isActive = (path) => location.pathname === path;

  return token ? (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-white rounded-lg p-1">
                <div className="bg-gradient-to-r from-indigo-400 to-purple-500 w-8 h-8 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
              </div>
              <span className="ml-3 text-white text-xl font-bold">SocialWave</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
                    isActive(item.path)
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              
              {/* Create Post with "+" icon */}
              <Link
                to="/home/createpost"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
                  isActive("/home/createpost")
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-700'
                }`}
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Post
              </Link>
            </div>
          </div>

          {/* User section */}
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="bg-indigo-200 border-2 border-white rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-indigo-800 font-bold">
                    {username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="ml-2 text-white font-medium">{username}</span>
              </div>
            </div>
            <Link
              to="/"
              className="ml-4 bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg transition-all"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-white rounded-lg p-1">
                <div className="bg-gradient-to-r from-indigo-400 to-purple-500 w-8 h-8 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
              </div>
              <span className="ml-3 text-white text-xl font-bold">SocialWave</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <Link
              to="/SignUp"
              className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all"
            >
              SignUp
            </Link>
            <Link
              to="/LogIn"
              className="ml-4 bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg transition-all"
            >
              LogIn
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </nav>
  );
};

export default Navbar;