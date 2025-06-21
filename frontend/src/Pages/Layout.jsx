import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col">
      {/* Centered Card */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all hover:shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">Welcome!</h1>
            <p className="text-gray-500">Get started with your journey</p>
          </div>

          <div className="space-y-4 mb-6">
            <Link 
              to="/login" 
              className="block bg-indigo-600 text-white text-center py-3 px-4 rounded-xl font-medium transition-all hover:bg-indigo-700 hover:scale-[1.02]"
            >
              Login to Account
            </Link>
            
            <Link 
              to="/signup" 
              className="block border-2 border-indigo-500 text-indigo-600 text-center py-3 px-4 rounded-xl font-medium transition-all hover:bg-indigo-50 hover:scale-[1.02]"
            >
              Create New Account
            </Link>
          </div>

          <p className="text-center text-gray-500 text-sm border-t border-gray-100 pt-4">
            Wanna surf first? <span className="hover:text-blue-400 py-2 px-4 "><Link to="/home">Continue without an account</Link></span>
          </p>
        </div>
      </div>

      <Outlet />
    </div>
  )
};

export default Layout;