import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import

const LogIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // clear errors when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    }

    const formvalidation = (data) => {
        const validationErrors = {};

        if (!data.email) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            validationErrors.email = 'Email is invalid';
        }
        if (!data.password) {
            validationErrors.password = 'Password is required';
        } else if (data.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters';
        }

        return validationErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(''); // Clear previous messages
        
        const validationErrors = formvalidation(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Login successful');
                // Store token in localStorage or context
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                setMessage(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all hover:shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-indigo-700 mb-2">Welcome Back</h1>
                        <p className="text-gray-500">Sign in to continue your journey</p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-center ${
                            message.includes('error') || message.includes('failed') || message.includes('An error occurred')
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
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
                                <p className="text-sm text-red-500 mt-2">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
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
                                <p className="text-sm text-red-500 mt-2">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="mb-6 text-right">
                            <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800 text-sm">
                                Forgot Password?
                            </Link>
                        </div>

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
                                    Logging in...
                                </span>
                            ) : 'Log In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-600">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-indigo-600 font-medium hover:text-indigo-800">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;