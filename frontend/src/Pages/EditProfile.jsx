import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    age: "",
    profilePic: {},
    bio: "",
    email: "",
    mobileNumber: "",
    interests: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const navigate = useNavigate();

  // Fetch current profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData((prev) => ({
          ...prev,
          ...response.data,
          firstName: response.data.firstName ?? "",
          lastName: response.data.lastName ?? "",
          username: response.data.username ?? "",
          age: response.data.age ?? "",
          bio: response.data.bio ?? "",
          email: response.data.email ?? "",
          mobileNumber: response.data.mobileNumber ?? "",
          interests: Array.isArray(response.data.interests)
            ? response.data.interests
            : [],
          profilePic: response.data.profilePic || {},
        }));

        if (
          response.data.profilePic &&
          response.data.profilePic !== "default_profile_pic.png"
        ) {
          setProfileImagePreview(
            `http://localhost:5000/uploads/profile-image/${profilePic.filename}`
          );
        }
      } catch (error) {
        setMessage({
          text: "Failed to load profile data",
          type: "error",
        });
      }
    };
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setProfileData({
        ...profileData,
        profilePic: file,
      });
    }
  };

  const handleInterestChange = (e) => {
    const { value } = e.target;
    if (e.key === "Enter" && value.trim()) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, value.trim()],
      });
      e.target.value = "";
    }
  };

  const removeInterest = (index) => {
    const newInterests = [...profileData.interests];
    newInterests.splice(index, 1);
    setProfileData({
      ...profileData,
      interests: newInterests,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!profileData.username.trim()) {
      formErrors.username = "Username is required";
    }
    if (!profileData.firstName.trim()) {
      formErrors.firstName = "First name is required";
    }
    if (!profileData.lastName.trim()) {
      formErrors.lastName = "Last name is required";
    }
    if (
      !profileData.age ||
      isNaN(profileData.age) ||
      profileData.age < 13 ||
      profileData.age > 120
    ) {
      formErrors.age = "Please enter a valid age (13-120)";
    }
    if (
      !profileData.email.trim() ||
      !/^\S+@\S+\.\S+$/.test(profileData.email)
    ) {
      formErrors.email = "Valid email is required";
    }
    if (
      !profileData.mobileNumber.trim() ||
      !/^\d{10}$/.test(profileData.mobileNumber)
    ) {
      formErrors.mobileNumber = "Valid 10-digit mobile number is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();

      // Append all fields to formData
      Object.keys(profileData).forEach((key) => {
        if (key === "interests") {
          formData.append(key, JSON.stringify(profileData[key]));
        } else if (key !== "profilePic") {
          formData.append(key, profileData[key]);
        }
      });

      if (profileData.profilePic instanceof File) {
        formData.append("profilePic", profileData.profilePic);
      }

      const response = await axios.put("http://localhost:5000/api/user/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({
        text: "Profile updated successfully!",
        type: "success",
      });
      setTimeout(() => navigate("/home/profile"), 1500);
    } catch (error) {
      let errorMessage = "An error occurred while updating profile";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      }
      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Edit Your Profile</h1>
            <p className="text-indigo-100">Update your personal information</p>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div
              className={`p-4 ${
                message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Picture Upload */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-indigo-100 overflow-hidden border-4 border-white shadow-lg">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl text-indigo-600">
                        {profileData.firstName?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profilePic"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 cursor-pointer transition-all"
                >
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    id="profilePic"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Click on the icon to change your profile picture
              </p>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.username
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                  placeholder="Your username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="13"
                  max="120"
                  value={profileData.age}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.age
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                  placeholder="Your age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={profileData.mobileNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.mobileNumber
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                  placeholder="10-digit mobile number"
                />
                {errors.mobileNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-200"
                placeholder="Tell us something about yourself..."
              />
            </div>

            {/* Interests */}
            <div className="mt-6">
              <label
                htmlFor="interests"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Interests
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profileData.interests && profileData.interests.length > 0 ? (
                  profileData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(index)}
                        className="ml-2 text-indigo-500 hover:text-indigo-700"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No interests added yet
                  </p>
                )}
              </div>
              <input
                type="text"
                id="interests"
                name="interests"
                onKeyDown={handleInterestChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-200"
                placeholder="Type an interest and press Enter"
              />
              <p className="mt-1 text-sm text-gray-500">
                Add your interests one by one
              </p>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/home/profile")}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg font-medium text-white transition-colors flex items-center ${
                  isSubmitting
                    ? "bg-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
