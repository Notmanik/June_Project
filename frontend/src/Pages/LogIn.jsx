import {useState} from 'react';
import { useNavigate} from 'react-router-dom';
const LogIn = () => {
    const [formData, setFormData] = useState({
        email:'',
        password:''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name , value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // clear errors when user types
        if(errors[name]){
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    }
    const formvalidation = (data) => {
            const validationErrors = {};

            if(!data.email){
                validationErrors.email = 'Email is required';
            } else if(!/\S+@\S+\.\S+/.test(data.email)){
                validationErrors.email = 'Email is invalid';
            }
            if(!data.password){
                validationErrors.password = 'Password is required';
            } else if(data.password.length < 8){
                validationErrors.password = 'Password must be at least 8 characters';

            }
            
            return validationErrors;
        }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const validationErrors = formvalidation(formData);
        if(Object.keys(validationErrors).length > 0){
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
            if(response.ok){
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Log In</h2>
        
        {message && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
                message.type === 'error' 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100' 
                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
            }`}>
                {message.text}
            </div>
        )}
        
        <form onSubmit={handleSubmit}>
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
                    required
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
                    required
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

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
        </form>
    </div>
</div>
    )
}
export default LogIn;