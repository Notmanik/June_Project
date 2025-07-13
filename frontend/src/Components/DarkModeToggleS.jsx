//? S stands for simple
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
// Optional: import icons from react-icons
// import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const DarkModeToggleS = () => {
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

export default DarkModeToggleS;
