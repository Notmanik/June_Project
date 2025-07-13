import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check localStorage first, fallback to system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setDarkMode(true);
    } else if (storedTheme === 'light') {
      setDarkMode(false);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemPrefersDark);
      localStorage.setItem('theme', systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode, isMounted]);

  if (!isMounted) {
    return (
      <div className="relative">
        <div className="w-16 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full shadow-lg animate-pulse" />
      </div>
    );
  }
  return (
    <div className="relative">
      {/* Outer glow effect */}
      <div className={`absolute inset-0 rounded-full blur-md transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 opacity-60' 
          : 'bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 opacity-50'
      }`} />
      
      {/* Main toggle container */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`relative w-16 h-8 rounded-full p-1 transition-all duration-500 ease-out transform hover:scale-105 active:scale-95 ${
          darkMode
            ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 shadow-2xl shadow-blue-500/20'
            : 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-2xl shadow-yellow-500/20'
        }`}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Sliding background */}
        <div 
          className={`absolute inset-1 rounded-full transition-all duration-500 ease-out ${
            darkMode 
              ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900'
              : 'bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400'
          }`}
        />
        
        {/* Sliding orb */}
        <div 
          className={`relative w-6 h-6 rounded-full transition-all duration-500 ease-out transform ${
            darkMode ? 'translate-x-8' : 'translate-x-0'
          } ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 shadow-lg shadow-blue-400/30'
              : 'bg-gradient-to-br from-white via-yellow-100 to-orange-100 shadow-lg shadow-orange-400/30'
          }`}
        >
          {/* Icon container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Moon icon */}
            <div 
              className={`absolute transition-all duration-500 ease-out ${
                darkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-180'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-600" />
            </div>
            
            {/* Sun icon */}
            <div 
              className={`absolute transition-all duration-500 ease-out ${
                darkMode ? 'opacity-0 scale-50 -rotate-180' : 'opacity-100 scale-100 rotate-0'
              }`}
            >
              <Sun className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          
          {/* Animated rays for sun */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            darkMode ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
          }`}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-0.5 h-1 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-full animate-pulse`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-10px)`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
        {/* Inner highlight */}
        <div className={`absolute inset-1 rounded-full transition-all duration-500 ${
          darkMode 
            ? 'bg-gradient-to-t from-transparent via-blue-400/10 to-indigo-400/20'
            : 'bg-gradient-to-t from-transparent via-yellow-200/20 to-white/30'
        }`} />
      </button>
    </div>
  );
};
export default DarkModeToggle;