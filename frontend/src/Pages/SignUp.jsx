import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        age: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const validationErrors = {};

        // Username validation
        if (!formData.username.trim()) {
            validationErrors.username = 'Username is required';
        } else if (formData.username.length < 4) {
            validationErrors.username = 'Username must be at least 4 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            validationErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!formData.password) {
            validationErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters';
        }

        // Confirm password validation
        if (!formData.confirm_password) {
            validationErrors.confirm_password = 'Please confirm your password';
        } else if (formData.confirm_password !== formData.password) {
            validationErrors.confirm_password = 'Passwords do not match';
        }
        
        // First name validation
        if (!formData.firstName.trim()) {
            validationErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            validationErrors.firstName = 'First name must be at least 2 characters';
        }

        // Last name validation
        if (!formData.lastName.trim()) {
            validationErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            validationErrors.lastName = 'Last name must be at least 2 characters';
        }

        // Mobile number validation
        if (!formData.mobileNumber.trim()) {
            validationErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
            validationErrors.mobileNumber = 'Mobile number must be 10 digits';
        }

        // Age validation
        if (!formData.age) {
            validationErrors.age = 'Age is required';
        } else if (isNaN(formData.age) || formData.age < 13 || formData.age > 120) {
            validationErrors.age = 'Age must be between 13 and 120';
        }

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                // Prepare data for backend (exclude confirm_password)
                const { confirm_password, ...submitData } = formData;
                
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submitData)
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage({ 
                        type: 'success', 
                        text: 'Registration successful! Redirecting to login...' 
                    });
                    
                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else {
                    // Handle backend validation errors
                    if (data.errors) {
                        setErrors(data.errors);
                    } else {
                        setMessage({
                            type: 'error',
                            text: data.message || 'Registration failed. Please try again.'
                        });
                    }
                }
            } catch (error) {
                console.error('Registration error:', error);
                setMessage({
                    type: 'error',
                    text: 'Network error. Please check your connection and try again.'
                });
            }
        } else {
            setMessage({
                type: 'error',
                text: 'Please fix the errors in the form'
            });
        }
        
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl transition-all hover:shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-indigo-700 mb-2">Create Your Account</h1>
                        <p className="text-gray-500">Join our community today</p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-center ${
                            message.type === 'error' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-green-100 text-green-700'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="username"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.username 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                                {errors.username && (
                                    <p className="absolute -bottom-5 left-0 text-sm text-red-500 mt-1">
                                        {errors.username}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.email 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && (
                                    <p className="absolute -bottom-5 left-0 text-sm text-red-500 mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.password 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && (
                                    <p className="absolute -bottom-5 left-0 text-sm text-red-500 mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="confirm_password"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.confirm_password 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                    placeholder="Confirm Password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                />
                                {errors.confirm_password && (
                                    <p className="absolute -bottom-5 left-0 text-sm text-red-500 mt-1">
                                        {errors.confirm_password}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* First Name */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="firstName"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.firstName 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && (
                                    <p className="absolute -bottom-5 left-0 text-sm text-red-500 mt-1">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="lastName"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.lastName 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && (
                                    <p className="absolute -bottom-5 left-0 text-sm text-red-500 mt-1">
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.mobileNumber 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                    placeholder="Mobile Number"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                />
                                {errors.mobileNumber && (
                                    <p className="absolute -bottom-5 left-0 text-sm text-red-500 mt-1">
                                        {errors.mobileNumber}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Age */}
                        <div>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="age"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.age 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                    placeholder="Age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="13"
                                    max="120"
                                />
                                {errors.age && (
                                    <p className="absolute -bottom-5 left-0 text-sm text-red-500 mt-1">
                                        {errors.age}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-2">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium transition-all hover:bg-indigo-700 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-gray-600">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-800">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;