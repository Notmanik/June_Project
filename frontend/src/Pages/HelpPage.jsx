import React from "react";
import { Link } from "react-router-dom";

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-white text-indigo-900 px-6 py-12 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 border-b pb-2 border-indigo-100">
            🛠️ Help & Support
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Welcome to <span className="font-bold text-indigo-600">Vistara Help Center</span>. Here's a guide to help you navigate and use the platform efficiently.
          </p>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-indigo-50 border-l-4 border-indigo-500 shadow">
              <h2 className="text-xl font-bold text-indigo-700">🔐 Account Setup</h2>
              <p className="text-indigo-900 mt-1">
                Go to <Link to="/signup" className="underline font-semibold hover:text-indigo-500">Sign Up</Link> to create a new account. Already have one? Just <Link to="/login" className="underline font-semibold hover:text-indigo-500">Login</Link>.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-indigo-50 border-l-4 border-indigo-500 shadow">
              <h2 className="text-xl font-bold text-indigo-700">👤 Updating Your Profile</h2>
              <p className="text-indigo-900 mt-1">
                Visit <Link to="/home/profile" className="underline font-semibold hover:text-indigo-500">your profile</Link> to update your picture, bio, and interests.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-indigo-50 border-l-4 border-indigo-500 shadow">
              <h2 className="text-xl font-bold text-indigo-700">📝 Creating Posts</h2>
              <p className="text-indigo-900 mt-1">
                Head to <Link to="/home/createpost" className="underline font-semibold hover:text-indigo-500">Create Post</Link> from the navigation bar to share your content with the community.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-indigo-50 border-l-4 border-indigo-500 shadow">
              <h2 className="text-xl font-bold text-indigo-700">⚙️ Settings</h2>
              <p className="text-indigo-900 mt-1">
                Modify your preferences from the <Link to="/home/settings" className="underline font-semibold hover:text-indigo-500">Settings</Link> page.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-indigo-50 border-l-4 border-indigo-500 shadow">
              <h2 className="text-xl font-bold text-indigo-700">❓ Need more help?</h2>
              <p className="text-indigo-900 mt-1">
                Reach out via our <span className="font-semibold">Support Email:</span> <a href="mailto:support@vistara.com" className="underline hover:text-indigo-500">support@vistara.com</a>
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/home"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full shadow hover:bg-indigo-700 hover:scale-105 transition transform duration-200"
            >
              ⬅️ Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
