import { useState, useEffect } from 'react';
import { Moon, Sun, ImagePlus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <header className="py-6 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center">Vistara</div>
          <DarkModeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <section className="text-center mb-24">
          <h1 className="text-5xl font-extrabold mb-6">Capture. Share. Connect.</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A modern social media platform where you can share your moments, explore users, and connect with a creative community.
          </p>
          <Link to="/auth" className="mt-6 inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors duration-300">
          {/* <button className="mt-8 bg-indigo-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors duration-300"> */}
            Get Started
          {/* </button> */}
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <ImagePlus className="w-10 h-10 mb-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xl font-bold mb-2">Upload Your Story</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Share images with descriptions to let the world know what you're up to. Express yourself visually and creatively.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <Search className="w-10 h-10 mb-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xl font-bold mb-2">Explore Users</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Discover new profiles, connect with like-minded individuals, and grow your network in the Explore section.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-2">Secure & Fast</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built with modern JWT-based authentication, your data is protected, and your experience is seamless.
            </p>
          </div>
        </section>

        <section className="mt-24 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 rounded-3xl p-8">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to join the community?</h2>
            <p className="mb-6">Sign up now and start building your social presence with just a few clicks.</p>
            <button className="bg-white text-indigo-700 font-medium py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-300">
              <Link to="/auth">Join Now</Link>
            </button>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-center">
        <p className="text-gray-600 dark:text-gray-400">© 2025 Vistara. All rights reserved.</p>
      </footer>
    </div>
  );
};
export default LandingPage;