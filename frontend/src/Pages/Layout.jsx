import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
// Optional: import icons from react-icons
// import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedMode ? savedMode === 'true' : systemPrefersDark);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode, isMounted]);

  if (!isMounted) return <div className="w-5 h-5" />;

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <div className={`absolute inset-0 transition-all duration-500 ${darkMode ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`}>
          <Moon className="w-5 h-5 text-blue-600" />
        </div>
        <div className={`absolute inset-0 transition-all duration-500 ${darkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`}>
          <Sun className="w-5 h-5 text-yellow-500" />
        </div>
      </div>
    </button>
  );
};

const Layout = () => {
  return (
      <div className="min-h-screen px-4 sm:px-6 bg-indigo-100 dark:bg-gray-900 flex items-center justify-center transition-all duration-500">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-shadow duration-300">
          
          {/* Left Panel */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center transition-all duration-500">
            <h2 className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              Hello, <span className="text-blue-600 dark:text-blue-400">welcome!</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-300 mb-8">Please login or create a new account</p>

            <div className="space-y-4">
              <Link
                to="/login"
                className="block bg-gradient-to-l from-indigo-600 to-blue-500 text-white text-center py-3 px-4 rounded-lg font-semibold transition-all hover:from-indigo-500 hover:to-blue-400 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block border-2 border-blue-600 text-blue-600 text-center py-3 px-4 rounded-lg font-semibold transition-all hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign up
              </Link>
            </div>

            <div className="text-right text-sm text-gray-500 mt-4 hover:text-blue-400 cursor-pointer">
              Forget password?
            </div>

            <div className="flex justify-center space-x-4 mt-10 text-gray-500">
              <a href="#"><i className="fab fa-facebook-f hover:text-blue-600" /></a>
              <a href="#"><i className="fab fa-twitter hover:text-blue-400" /></a>
              <a href="#"><i className="fab fa-instagram hover:text-pink-500" /></a>
              {/* If you're using react-icons:
              <FaFacebookF className="hover:text-blue-600" />
              <FaTwitter className="hover:text-blue-400" />
              <FaInstagram className="hover:text-pink-500" /> */}
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              Wanna surf first?{' '}
              <Link to="/home" className="hover:text-blue-400">
                Continue without an account
              </Link>
            </p>
            <p className="text-center text-gray-500 text-sm mt-2">
              <DarkModeToggle />
            </p>
          </div>

          {/* Right Panel - Gradient Visual */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-500 items-center justify-center relative overflow-hidden">
            <div className="absolute rounded-full bg-pink-300 mix-blend-overlay w-96 h-96 top-[-80px] left-[-80px] opacity-70 blur-2xl" />
            <div className="absolute rounded-full bg-blue-300 mix-blend-overlay w-80 h-80 bottom-[-60px] right-[-60px] opacity-70 blur-2xl" />
            <h1 className="text-white text-6xl font-black z-10 animate-pulse">Welcome</h1>
          </div>
        </div>

        <Outlet />
      </div>
  );
};

export default Layout;