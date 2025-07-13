import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
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

const LogIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const formvalidation = (data) => {
    const validationErrors = {};
    if (!data.email) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      validationErrors.email = "Email is invalid";
    }
    if (!data.password) {
      validationErrors.password = "Password is required";
    } else if (data.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const validationErrors = formvalidation(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Login successful");
        sessionStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
  <div className="min-h-screen bg-indigo-100 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-500">
    <div className="flex w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500">
      
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Sign in to continue your journey
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-center ${
              message.toLowerCase().includes("error") ||
              message.toLowerCase().includes("fail")
                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-200"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-2">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 ${
                errors.password
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-200"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-2">{errors.password}</p>
            )}
          </div>

          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
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
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              Sign up
            </Link>
          </p>
          <p>
            <span>Or switch to </span>
            <Link
              to="/home"
              className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300"
            >
              Home
            </Link>
            <span> to explore more.</span>

          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <DarkModeToggle />
          </p>
        </div>
      </div>

      {/* Right side - Gradient */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-500 items-center justify-center relative overflow-hidden">
        <div className="absolute rounded-full bg-pink-300 mix-blend-overlay w-96 h-96 top-[-80px] left-[-80px] opacity-70 blur-2xl" />
        <div className="absolute rounded-full bg-blue-300 mix-blend-overlay w-80 h-80 bottom-[-60px] right-[-60px] opacity-70 blur-2xl" />
        <h1 className="text-white text-6xl font-black z-10 text-center">
          Happy to have you back
        </h1>
      </div>
    </div>
  </div>
);
};
export default LogIn;