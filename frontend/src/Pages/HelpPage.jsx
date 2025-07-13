import React from "react";
import { Link } from "react-router-dom";
import DarkModeToggleS from "../Components/DarkModeToggleS";

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-indigo-900 dark:text-gray-100 px-4 py-8 sm:px-8 lg:px-16 transition-colors duration-500">
      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-850 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transition-all duration-500 dark:shadow-2xl dark:shadow-gray-900/50 border border-white/50 dark:border-gray-700 dark:bg-slate-900">
        <div className="p-6 sm:p-8 md:p-10">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 pb-3 border-b border-indigo-100/50 dark:border-gray-700/50">
              🛠️ Help Center
            </h1>
            <div className="mt-1">
              <DarkModeToggleS />
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-3xl leading-relaxed">
            Welcome to <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Vistara Support</span>. Find quick answers to common questions and guides to help you get the most out of our platform.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: "🔐",
                title: "Account Setup",
                content: (
                  <>
                    Go to <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline underline-offset-3 decoration-indigo-300/50 hover:decoration-indigo-500">Sign Up</Link> to create a new account. Already have one? Just <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline underline-offset-3 decoration-indigo-300/50 hover:decoration-indigo-500">Login</Link>.
                  </>
                )
              },
              {
                icon: "👤",
                title: "Updating Profile",
                content: (
                  <>
                    Visit <Link to="/home/profile" className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline underline-offset-3 decoration-indigo-300/50 hover:decoration-indigo-500">your profile</Link> to update your picture, bio, and interests.
                  </>
                )
              },
              {
                icon: "📝",
                title: "Creating Posts",
                content: (
                  <>
                    Head to <Link to="/home/createpost" className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline underline-offset-3 decoration-indigo-300/50 hover:decoration-indigo-500">Create Post</Link> from the navigation bar to share content.
                  </>
                )
              },
              {
                icon: "⚙️",
                title: "App Settings",
                content: (
                  <>
                    Customize your experience in <Link to="/home/settings" className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline underline-offset-3 decoration-indigo-300/50 hover:decoration-indigo-500">Settings</Link>.
                  </>
                )
              },
              {
                icon: "❓",
                title: "Additional Support",
                content: (
                  <>
                    Contact us at <a href="mailto:support@vistara.com" className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline underline-offset-3 decoration-indigo-300/50 hover:decoration-indigo-500">support@vistara.com</a> for personalized assistance.
                  </>
                )
              }
            ].map(({ icon, title, content }, index) => (
              <div 
                key={index} 
                className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="flex items-start">
                  <span className="text-2xl p-3 mr-4 bg-indigo-100/50 dark:bg-gray-700 rounded-xl group-hover:bg-indigo-200/30 dark:group-hover:bg-gray-600 transition-colors">
                    {icon}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 focus:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;