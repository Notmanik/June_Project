import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [message, setMessage] = useState('');
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

    const validateForm = (data) => {
        const validationErrors = {};

        // Username validation
        if (!data.username.trim()) {
            validationErrors.username = 'Username is required';
        } else if (data.username.length < 4) {
            validationErrors.username = 'Username must be at least 4 characters long';
        }

        // Email validation
        if (!data.email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            validationErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!data.password) {
            validationErrors.password = 'Password is required';
        } else if (data.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters long';
        }

        // Confirm password validation
        if (data.confirm_password !== data.password) {
            validationErrors.confirm_password = 'Passwords do not match';
        }
        
        // First name validation
        if (!data.firstName.trim()) {
            validationErrors.firstName = 'First name is required';
        } else if (data.firstName.length < 2) {
            validationErrors.firstName = 'First name must be at least 2 characters long';
        }

        // Last name validation
        if (!data.lastName.trim()) {
            validationErrors.lastName = 'Last name is required';
        } else if (data.lastName.length < 2) {
            validationErrors.lastName = 'Last name must be at least 2 characters long';
        }

        // Mobile number validation
        if (!data.mobileNumber.trim()) {
            validationErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(data.mobileNumber.replace(/\D/g, ''))) {
            validationErrors.mobileNumber = 'Mobile number must be 10 digits';
        }

        // Age validation
        if (!data.age) {
            validationErrors.age = 'Age is required';
        } else if (isNaN(data.age) || data.age < 0 || data.age > 120) {
            validationErrors.age = 'Age must be a valid number between 0 and 120';
        }

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        
        const validationErrors = validateForm(formData);
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
                    setMessage('Registration successful! You can now login.');
                    // Reset form after successful submission
                    setFormData({
                        username: '',
                        email: '',
                        password: '',
                        confirm_password: '',
                        firstName: '',
                        lastName: '',
                        mobileNumber: '',
                        age: ''
                    });
                    setErrors({});
                    navigate('/login');

                } else {
                    // Handle backend validation errors
                    if (data.errors) {
                        setErrors(data.errors);
                    } else {
                        setMessage(data.message || 'Registration failed. Please try again.');
                    }
                }
            } catch (error) {
                console.error('Registration error:', error);
                setMessage('Network error. Please check your connection and try again.');
            }
        } else {
            console.log('Form has errors:', validationErrors);
        }
        
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Sign Up Form</h2>

                {/* Success/Error Message */}
                {message && (
                    <div className={`mb-4 p-3 rounded ${
                        message.includes('successful') 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Username */}
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="username"
                        id="username"
                        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white focus:outline-none focus:ring-0 peer ${
                            errors.username 
                                ? 'border-red-500 dark:border-red-500 focus:border-red-500' 
                                : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-600'
                        }`}
                        placeholder=" "
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <label
                        htmlFor="username"
                        className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                            errors.username ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        Username
                    </label>
                    {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                </div>

                {/* Email */}
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white focus:outline-none focus:ring-0 peer ${
                            errors.email 
                                ? 'border-red-500 dark:border-red-500 focus:border-red-500' 
                                : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-600'
                        }`}
                        placeholder=" "
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <label
                        htmlFor="email"
                        className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                            errors.email ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        Email address
                    </label>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white focus:outline-none focus:ring-0 peer ${
                            errors.password 
                                ? 'border-red-500 dark:border-red-500 focus:border-red-500' 
                                : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-600'
                        }`}
                        placeholder=" "
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <label
                        htmlFor="password"
                        className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                            errors.password ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        Password
                    </label>
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white focus:outline-none focus:ring-0 peer ${
                            errors.confirm_password 
                                ? 'border-red-500 dark:border-red-500 focus:border-red-500' 
                                : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-600'
                        }`}
                        placeholder=" "
                        value={formData.confirm_password}
                        onChange={handleChange}
                    />
                    <label
                        htmlFor="confirm_password"
                        className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                            errors.confirm_password ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        Confirm Password
                    </label>
                    {errors.confirm_password && <p className="mt-1 text-sm text-red-500">{errors.confirm_password}</p>}
                </div>

                {/* First & Last Name */}
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white focus:outline-none focus:ring-0 peer ${
                                errors.firstName 
                                    ? 'border-red-500 dark:border-red-500 focus:border-red-500' 
                                    : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-600'
                            }`}
                            placeholder=" "
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="firstName"
                            className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                                errors.firstName ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            First Name
                        </label>
                        {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white focus:outline-none focus:ring-0 peer ${
                                errors.lastName 
                                    ? 'border-red-500 dark:border-red-500 focus:border-red-500' 
                                    : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-600'
                            }`}
                            placeholder=" "
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="lastName"
                            className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                                errors.lastName ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            Last Name
                        </label>
                        {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                    </div>
                </div>

                {/* Mobile Number & Age */}
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="tel"
                            name="mobileNumber"
                            id="mobileNumber"
                            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white focus:outline-none focus:ring-0 peer ${
                                errors.mobileNumber 
                                    ? 'border-red-500 dark:border-red-500 focus:border-red-500' 
                                    : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-600'
                            }`}
                            placeholder=" "
                            value={formData.mobileNumber}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="mobileNumber"
                            className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                                errors.mobileNumber ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            Mobile Number
                        </label>
                        {errors.mobileNumber && <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            name="age"
                            id="age"
                            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white focus:outline-none focus:ring-0 peer ${
                                errors.age 
                                    ? 'border-red-500 dark:border-red-500 focus:border-red-500' 
                                    : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-600'
                            }`}
                            placeholder=" "
                            value={formData.age}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="age"
                            className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                                errors.age ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            Age
                        </label>
                        {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className={`w-full px-5 py-2.5 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none ${
                        isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                    }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default SignUp;