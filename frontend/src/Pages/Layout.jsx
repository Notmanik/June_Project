import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-indigo-100 flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="w-full">
            <h2 className="text-4xl font-bold text-indigo-600 mb-2">
              Hello, <span className="text-blue-600">welcome!</span>
            </h2>
            <p className="text-gray-500 mb-8">Please login or create a new account</p>

            <div className="space-y-4">
              <Link
                to="/login"
                className="block bg-gradient-to-l from-indigo-600 to-blue-500 text-white text-center py-3 px-4 rounded-lg font-semibold transition-all hover:from-indigo-500 hover:to-blue-400 hover:shadow-lg"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="block border-2 border-blue-600 text-blue-600 text-center py-3 px-4 rounded-lg font-semibold transition-all hover:bg-blue-50"
              >
                Sign up
              </Link>
            </div>

            <div className="text-right text-sm text-gray-500 mt-4">
              <span className="hover:text-blue-400 cursor-pointer">Forget password?</span>
            </div>

            <div className="flex justify-center space-x-4 mt-10 text-gray-500">
              <a href="#"><i className="fab fa-facebook-f hover:text-blue-600"></i></a>
              <a href="#"><i className="fab fa-twitter hover:text-blue-400"></i></a>
              <a href="#"><i className="fab fa-instagram hover:text-pink-500"></i></a>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              Wanna surf first?{" "}
              <span className="hover:text-blue-400">
                <Link to="/home">Continue without an account</Link>
              </span>
            </p>
          </div>
        </div>

        {/* Right Panel - Gradient Visual */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-500 items-center justify-center relative overflow-hidden">
          <div className="absolute rounded-full bg-pink-300 mix-blend-overlay w-96 h-96 top-[-80px] left-[-80px] opacity-70 blur-2xl"></div>
          <div className="absolute rounded-full bg-blue-300 mix-blend-overlay w-80 h-80 bottom-[-60px] right-[-60px] opacity-70 blur-2xl"></div>
          <h1 className="text-white text-6xl font-black z-10">Welcome</h1>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default Layout;
